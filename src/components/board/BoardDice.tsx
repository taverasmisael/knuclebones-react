import * as rambda from "rambda";
import type { ReactElement } from "react";
import { DiceValue } from "../../game-logic/dice";
import { rollDice } from "../../utils/dice";
import { Optional, Some, unwrapOr } from "../../utils/optional";
import styles from "./BoardDice.module.css";

interface BoardDiceProps {
	set: (value: Optional<DiceValue>) => void;
	value: Optional<DiceValue>;
	disabled?: boolean;
}

export default function BoardDice(props: BoardDiceProps) {
	return (
		<div className={styles.container}>
			<button
				disabled={props.disabled}
				className={styles.dice}
				aria-label={unwrapOr(undefined, props.value.map(rambda.toString))}
				onClick={() => props.set(Some(rollDice()))}
			>
				{unwrapOr<ReactElement>(<strong>ROLL</strong>, props.value.map(createDiceFace))}
			</button>
		</div>
	);
}

function createDiceFace(value: DiceValue): ReactElement {
	const radius = 10;
	switch (value) {
		case 1:
			return (
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<circle cx="50" cy="50" r={radius} />
				</svg>
			);
		case 2:
			return (
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<circle cx="25" cy="25" r={radius} />
					<circle cx="75" cy="75" r={radius} />
				</svg>
			);
		case 3:
			return (
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<circle cx="25" cy="25" r={radius} />
					<circle cx="50" cy="50" r={radius} />
					<circle cx="75" cy="75" r={radius} />
				</svg>
			);
		case 4:
			return (
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<circle cx="25" cy="25" r={radius} />
					<circle cx="25" cy="75" r={radius} />
					<circle cx="75" cy="25" r={radius} />
					<circle cx="75" cy="75" r={radius} />
				</svg>
			);
		case 5:
			return (
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<circle cx="25" cy="25" r={radius} />
					<circle cx="25" cy="75" r={radius} />
					<circle cx="75" cy="25" r={radius} />
					<circle cx="75" cy="75" r={radius} />
					<circle cx="50" cy="50" r={radius} />
				</svg>
			);
		case 6:
			return (
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<circle cx="25" cy="25" r={radius} />
					<circle cx="25" cy="50" r={radius} />
					<circle cx="25" cy="75" r={radius} />
					<circle cx="75" cy="25" r={radius} />
					<circle cx="75" cy="50" r={radius} />
					<circle cx="75" cy="75" r={radius} />
				</svg>
			);
	}
}
