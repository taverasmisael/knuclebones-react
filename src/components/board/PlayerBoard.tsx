import clsx from "clsx";
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

const getRowOrientation = <T,>(isTop: boolean, row: T[]) => (isTop ? rambda.reverse(row) : row);

export default function PlayerBoard(props: PlayerBoardProps) {
	const onCellClick = (cellId: CellId) => () => props.onSelect(cellId);
	const isTop = props.position === PlayerBoardPosition.TOP;

	return (
		<div className={clsx(styles.container, styles[isTop ? "containerTop" : "containerBottom"])}>
			<div className={clsx(styles.board, { [styles.disabledBoard]: props.disabled })}>
				{props.board.map((row, rowIndex) => (
					// rome-ignore lint/suspicious/noArrayIndexKey: this is a fixed size array
					<div key={rowIndex} className={styles.row}>
						{getRowOrientation(isTop, row).map((cell, cellIndex) => (
							<button
								key={cell.id}
								data-cell-id={cellIndex}
								className={styles.cell}
								disabled={!cell.enabled}
								onClick={onCellClick(cell.id)}
							>
								{unwrapOr(cell.value.map(rambda.toString), "")}
							</button>
						))}
					</div>
				))}
			</div>
			<div className={clsx({ [styles.infoLeft]: isTop, [styles.infoRight]: !isTop })}>
				{isTop ? "Top" : "Bottom"} player
			</div>
		</div>
	);
}
