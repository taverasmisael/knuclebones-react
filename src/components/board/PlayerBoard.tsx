import clsx from "clsx";
import * as rambda from "rambda";
import { useState } from "react";
import { BoardSlice, CellId } from "../../game-logic/board";
import { DiceValue } from "../../game-logic/dice";
import { GamePlayer } from "../../game-logic/game-status";
import { PlayerBoardPosition } from "../../game-logic/player";
import { isNone, isSome, None, Optional, unwrapOr } from "../../utils/optional";
import BoardDice from "./BoardDice";

import styles from "./PlayerBoard.module.css";
import PlayerInfo from "./PlayerInfo";

interface PlayerBoardProps {
	enabled?: boolean;
	debug?: boolean;
	player: GamePlayer;
	position: PlayerBoardPosition;
	onSelect: (cell: CellId, value: DiceValue) => void;
	board: BoardSlice;
}

const getRowOrientation = <T,>(isTop: boolean, row: T[]) => (isTop ? rambda.reverse(row) : row);

export default function PlayerBoard(props: PlayerBoardProps) {
	const [diceValue, setDiceValue] = useState<Optional<DiceValue>>(None());
	const onCellClick = (cellId: CellId) => () => {
		if (isNone(diceValue)) return;
		setDiceValue((value) => {
			props.onSelect(cellId, value.unwrap());
			return None();
		});
	};
	const isTop = props.position === PlayerBoardPosition.TOP;

	return (
		<div className={clsx(styles.container, styles[isTop ? "containerTop" : "containerBottom"])} data-testid={`${props.position}-board`}>
			{props.debug && <div className={styles.debugRibbon}>DEBUG MODE ENABLED</div>}
			<div className={clsx({ [styles.infoLeft]: !isTop, [styles.infoRight]: isTop })}>
				{props.enabled && (
					<BoardDice disabled={isSome(diceValue)} set={setDiceValue} value={diceValue} />
				)}
			</div>
			<div
				aria-disabled={!props.enabled}
				className={clsx(styles.board, { [styles.disabledBoard]: !props.enabled })}
			>
				{props.board.map((row, rowIndex) => (
					// rome-ignore lint/suspicious/noArrayIndexKey: this is a fixed size array
					<div key={rowIndex} className={styles.row}>
						{getRowOrientation(isTop, row).map((cell) => (
							<button
								key={cell.id}
								data-testid={cell.id}
								className={styles.cell}
								disabled={!cell.enabled}
								onClick={onCellClick(cell.id)}
							>
								{unwrapOr(props.debug ? cell.id : "", cell.value.map(rambda.toString))}
							</button>
						))}
					</div>
				))}
			</div>
			<div className={clsx({ [styles.infoLeft]: isTop, [styles.infoRight]: !isTop })}>
				<PlayerInfo score={props.player.score} enabled={props.enabled} name={props.player.name} />
			</div>
		</div>
	);
}
