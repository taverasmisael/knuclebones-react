import * as rambda from "rambda";
import { DiceValue } from "../../game-logic/dice";
import { Optional, Some, unwrapOr } from "../../utils/optional";
import styles from "./BoardDice.module.css";

function rnd(min: DiceValue, max: DiceValue): DiceValue {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min) as DiceValue;
}

export default function BoardDice(props: BoardDiceProps) {
	return (
		<div className={styles.container}>
			<button className={styles.dice} onClick={() => props.set(Some(rnd(1, 6)))}>
				{unwrapOr("Roll!", props.value.map(rambda.toString))}
			</button>
		</div>
	);
}

interface BoardDiceProps {
	set: (value: Optional<DiceValue>) => void;
	value: Optional<DiceValue>;
}
