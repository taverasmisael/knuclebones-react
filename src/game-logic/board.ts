import * as R from "rambda";
import { produce } from "immer";
import { contains, isNone, isSome, None, Optional, Some, unwrapOr } from "../utils/optional";
import { DiceValue } from "./dice";
import { PlayerId, PlayerBoardPosition } from "./player";

export type BoardPosition = 0 | 1 | 2;
export type CellId = `${BoardPosition}-${BoardPosition}`;
export interface BoardValue {
	id: CellId;
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

export function cellIdToCoordinate(id: CellId): BoardCoordinate {
	return id.split("-").map(Number) as [BoardPosition, BoardPosition];
}

export function createEmptyBoard(): Board {
	return {
		top: createEmptyBoardSlice(),
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
	return R.pathOr(None(), [position, ...coordinate], board);
}

export function createFullBoardSlice(value: DiceValue = 1): BoardSlice {
	return Array.from({ length: 3 }, (_, ridx) =>
		Array.from({ length: 3 }, (_, cidx) => ({
			value: Some(value),
			enabled: false,
			id: `${ridx as BoardPosition}-${cidx as BoardPosition}`,
		})),
	);
}

export function createEmptyBoardSlice(): BoardSlice {
	return Array.from({ length: 3 }, (_, ridx) =>
		Array.from({ length: 3 }, (_, cidx) => ({
			value: None(),
			enabled: cidx === 0,
			id: `${ridx as BoardPosition}-${cidx as BoardPosition}`,
		})),
	);
}

export function makeMoveOnBoard(
	board: Board,
	position: PlayerBoardPosition,
	cellId: CellId,
	value: DiceValue,
): Board {
	return produce(board, (draft) => {
		const [row, column] = cellIdToCoordinate(cellId);
		const oppositePosition = position === PlayerBoardPosition.TOP ? "bottom" : "top";
		const cell = draft[position][row][column];
		if (isSome(cell.value)) throw new Error(`Cell ${cell.id} already played ${cell.value}`);
		if (!cell.enabled) throw new Error(`Invalid move on ${position} (${row}, ${column})`);
		draft[position][row][column] = {
			...cell,
			value: Some(value),
			enabled: false,
		};

		draft[oppositePosition] = displaceMovements(draft[oppositePosition], row, value);

		const nextCell = column + 1;
		if (nextCell < 3) {
			draft[position][row] = draft[position][row].map((cell, idx) => ({
				...cell,
				enabled: idx === nextCell,
			}));
		}
	});
}

export function getNextValidMove(board: BoardSlice, move?: BoardPosition): Optional<CellId> {
	const validCells = board.flat().filter((cell) => cell.enabled);
	const idx = Math.min(
		move ?? Math.floor(Math.random() * validCells.length),
		validCells.length - 1,
	);
	const cellId = validCells.map((cell) => cell.id)[idx];
	return Optional(cellId);
}

export const calculateBoardScore = R.pipe(R.map(calculateColumnScore), R.reduce(R.add, 0));

type CellValue = Pick<BoardValue, "value">;
const unwrapOrZero: (o: Optional<number>) => number = R.curry(unwrapOr)(0);
export function calculateColumnScore(column: CellValue[]): number {
	const group = R.pipe(
		R.map(R.pipe(R.prop("value"), unwrapOrZero)),
		R.groupBy<number>(R.toString),
	)(column);
	const sumGroup = (group: number[]) => R.sum(group) * group.length;
	const sumColValues = R.reduce<number[], number>((acc, group) => acc + sumGroup(group), 0);
	return R.pipe(R.values, sumColValues)(group);
}

// TODO: change function name
export function displaceMovements(
	slice: BoardSlice,
	row: BoardPosition,
	value: DiceValue,
): BoardSlice {
	return produce(slice, (b) => {
		b[row] = b[row].map((cell) =>
			contains(cell.value, value) ? { ...cell, enabled: false, value: None() } : cell,
		);
		const otherValues = b[row].filter((cell) => isSome(cell.value));
		if (otherValues.length) {
			b[row] = b[row].map((cell, idx) => ({
				...cell,
				value: R.pathOr(None(), [idx, "value"], otherValues),
				enabled: false,
			}));
		}

		const firstNone = b[row].findIndex((cell) => isNone(cell.value));
		if (firstNone !== -1) {
			b[row] = b[row].map((cell, idx) => ({
				...cell,
				enabled: idx === firstNone,
			}));
		}
	});
}
