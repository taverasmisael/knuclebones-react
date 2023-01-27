import { useEffect } from "react";
import "./App.css";
import { Board } from "./components/board";
import { CellId } from "./game-logic/board";
import { DiceValue } from "./game-logic/dice";
import { PlayerBoardPosition } from "./game-logic/player";
import { useNewgame } from "./game-logic/useKnucklebonesGame";
import { unwrapOr } from "./utils/optional";

function rnd(min: DiceValue, max: DiceValue): DiceValue {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min) as DiceValue;
}

function App() {
	const game = useNewgame();

	useEffect(() => {
		game.start(["Marcos", "Rome"]);
	}, []);

	const onSelect = (player: PlayerBoardPosition) => (cell: CellId) => {
		if (player === "top") {
			game.moveTopPlayer(cell, rnd(1, 6));
		} else {
			game.moveBottomPlayer(cell, rnd(1, 6));
		}
	};

	const gameBoard = game.getBoard().map((b) => (
		<>
			<Board
				position={PlayerBoardPosition.TOP}
				board={b.top}
				onSelect={onSelect(PlayerBoardPosition.TOP)}
			/>
			<hr />
			<Board
				position={PlayerBoardPosition.BOTTOM}
				board={b.bottom}
				onSelect={onSelect(PlayerBoardPosition.BOTTOM)}
			/>
		</>
	));

	return (
		<>
			<h1>Knucklebones</h1>
			{unwrapOr(gameBoard, <></>)}
		</>
	);
}

export default App;
