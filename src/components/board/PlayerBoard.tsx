import { BoardCoordinate, BoardSlice, BoardPosition } from "../../game-logic/board";
import { PlayerBoardPosition } from "../../game-logic/player";
import { isNone, unwrapOr } from "../../utils/optional";

import styles from "./PlayerBoard.module.css";

interface PlayerBoardProps {
	position: PlayerBoardPosition;
	onSelect: (coords: BoardCoordinate) => void;
	board: BoardSlice;
}

export default function PlayerBoard(props: PlayerBoardProps) {
	const onCellClick = (row: BoardPosition, cell: BoardPosition) => () =>
		props.onSelect([row, cell]);
	return (
		<div className={styles.board}>
			{props.board.map((row, rowIndex) =>
				row.map((cell, cellIndex) => (
					<button
						key={cell.id}
						className={styles.cell}
						disabled={isNone(cell.value) && !cell.enabled}
						onClick={onCellClick(rowIndex as BoardPosition, cellIndex as BoardPosition)}
					>
						{unwrapOr(
							cell.value.map((v) => v.toString()),
							`${rowIndex},${cellIndex}`,
						)}
					</button>
				)),
			)}
		</div>
	);
}
