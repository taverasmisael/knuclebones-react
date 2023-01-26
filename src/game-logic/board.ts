import { pathOr } from "rambda";
import { produce } from "immer";
import { isSome, None, Optional, Some } from "../utils/optional";
import { DiceValue } from "./dice";
import { PlayerId, PlayerBoardPosition } from "./player";

export type BoardPosition = 0 | 1 | 2;
export interface BoardValue {
	id: `${BoardPosition}-${BoardPosition}`;
	enabled: boolean;
	value: Optional<DiceValue>;
}
export type BoardCoordinate = [BoardPosition, BoardPosition];
export type BoardSlice = BoardValue[][];
export interface Board {
	top: BoardSlice;
	bottom: BoardSlice;
}
export interface GameBoard {
	board: Board;
	makeMove(player: PlayerId, row: number, column: number, value: DiceValue): Board;
}

export function createEmptyBoard(): Board {
	return {
		top: createEmptyBoardSlice(PlayerBoardPosition.TOP),
		bottom: createEmptyBoardSlice(),
	};
}

export function createFullBoard(): Board {
	return {
		top: createFullBoardSlice(),
		bottom: createFullBoardSlice(),
	};
}

export function getValueOnCoordinates(
	board: Board,
	position: PlayerBoardPosition,
	coordinate: BoardCoordinate,
): BoardValue | None {
	return pathOr(None(), [position, ...coordinate], board);
}

export function createFullBoardSlice(): BoardSlice {
	return Array.from({ length: 3 }, (_, ridx) =>
		Array.from({ length: 3 }, (_, cidx) => ({
			value: Some(1),
			enabled: false,
			id: `${ridx as BoardPosition}-${cidx as BoardPosition}`,
		})),
	);
}

export function createEmptyBoardSlice(
	position: PlayerBoardPosition = PlayerBoardPosition.BOTTOM,
): BoardSlice {
	return Array.from({ length: 3 }, (_, ridx) =>
		Array.from({ length: 3 }, (_, cidx) => ({
			value: None(),
			enabled: position === PlayerBoardPosition.BOTTOM ? cidx === 0 : cidx === 2,
			id: `${ridx as BoardPosition}-${cidx as BoardPosition}`,
		})),
	);
}

export function makeMoveOnBoard(
	board: Board,
	position: PlayerBoardPosition,
	coordinate: [number, number],
	value: DiceValue,
): Board {
	return produce(board, (draft) => {
		const [row, column] = coordinate;
		const cell = draft[position][row][column];
		if (isSome(cell.value)) throw new Error(`Cell already played ${cell.value}`);
		if (!cell.enabled) throw new Error(`Invalid move on ${position} (${row}, ${column})`);
		draft[position][row][column] = {
			...cell,
			value: Some(value),
			enabled: false,
		};

		const nextCell = position === PlayerBoardPosition.BOTTOM ? column + 1 : column - 1;
		if (nextCell >= 0 && nextCell < 3) {
			draft[position][row] = draft[position][row].map((cell, idx) => ({
				...cell,
				enabled: idx === nextCell,
			}));
		}
	});
}
