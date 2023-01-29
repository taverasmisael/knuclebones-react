import clsx from "clsx";
import { PlayerId } from "../../game-logic/player";
import styles from "./PlayerInfo.module.css";

interface PlayerInfoProps {
	name: PlayerId;
	score: number;
	enabled?: boolean;
}

export default function PlayerInfo(props: PlayerInfoProps) {
	return (
		<div className={clsx(styles.container, { [styles.active]: props.enabled })}>
			<h3 className={styles.name}>{props.name}</h3>
			{
				// TODO: this is a placeholder, we'll add the score later
				// getPlayerScore(props.playerId) // -> Number
			}
			<p className={styles.score}>
				<strong>Score:</strong> {props.score}
			</p>
		</div>
	);
}
