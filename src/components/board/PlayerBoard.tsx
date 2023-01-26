import * as rambda from "rambda";
import { BoardCoordinate, BoardSlice, BoardPosition } from "../../game-logic/board";
import { PlayerBoardPosition } from "../../game-logic/player";
import { unwrapOr } from "../../utils/optional";

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
			{props.board.map((row, rowIndex) => (
				// rome-ignore lint/suspicious/noArrayIndexKey: this is a fixed size array
				<div key={rowIndex} className={styles.row}>
					{row.map((cell, cellIndex) => (
						<button
							key={cell.id}
							data-cell-id={cellIndex}
							className={styles.cell}
							disabled={!cell.enabled}
							onClick={onCellClick(rowIndex as BoardPosition, cellIndex as BoardPosition)}
						>
							{unwrapOr(cell.value.map(rambda.toString), `${rowIndex}, ${cellIndex}(${cell.id})`)}
						</button>
					))}
				</div>
			))}
		</div>
	);
}
