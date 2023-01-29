import { useEffect } from "react";
import "./App.css";
import { Board } from "./components/board";
import { CellId } from "./game-logic/board";
import { DiceValue } from "./game-logic/dice";
import { PlayerBoardPosition } from "./game-logic/player";
import { useNewgame } from "./game-logic/useKnucklebonesGame";
import { unwrapOr, contains } from "./utils/optional";

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

	const gameBoard = game.getBoard().map((b) => {
		const players = game.players.unwrap();
		return (
			<>
				<Board
					enabled={contains(game.currentPlayer, PlayerBoardPosition.TOP)}
					position={PlayerBoardPosition.TOP}
					player={players.top}
					board={b.top}
					onSelect={onSelect(PlayerBoardPosition.TOP)}
				/>
				<hr />
				<Board
					enabled={contains(game.currentPlayer, PlayerBoardPosition.BOTTOM)}
					position={PlayerBoardPosition.BOTTOM}
					board={b.bottom}
					player={players.bottom}
					onSelect={onSelect(PlayerBoardPosition.BOTTOM)}
				/>
			</>
		);
	});

	return <>{unwrapOr(gameBoard, <></>)}</>;
}

export default App;
