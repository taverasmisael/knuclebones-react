import type React from "react";
import * as rambda from "rambda";
import { BoardSlice, CellId } from "../../game-logic/board";
import { PlayerBoardPosition } from "../../game-logic/player";
import { unwrapOr } from "../../utils/optional";

import styles from "./PlayerBoard.module.css";

interface PlayerBoardProps {
	disabled?: boolean;
	position: PlayerBoardPosition;
	onSelect: (cell: CellId) => void;
	board: BoardSlice;
}

export default function PlayerBoard(props: PlayerBoardProps) {
	const onCellClick = (cellId: CellId) => () => props.onSelect(cellId);

	const getRowOrientation = <T,>(row: T[]) =>
		props.position === "top" ? rambda.reverse(row) : row;
	console.log(props)
	return (
		<div className={`${styles.board} ${props.disabled ? styles.disabledBoard : ""}`}>
			{props.board.map((row, rowIndex) => (
				// rome-ignore lint/suspicious/noArrayIndexKey: this is a fixed size array
				<div key={rowIndex} className={styles.row}>
					{getRowOrientation(row).map((cell, cellIndex) => (
						<button
							key={cell.id}
							data-cell-id={cellIndex}
							className={styles.cell}
							disabled={!cell.enabled}
							onClick={onCellClick(cell.id)}
						>
							{unwrapOr(cell.value.map(rambda.toString), '')}
						</button>
					))}
				</div>
			))}
		</div>
	);
}
