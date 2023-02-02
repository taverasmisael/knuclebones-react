import { useEffect } from "react";
import "./App.css";
import { Board } from "./components/board";
import { CellId, getNextValidMove } from "./game-logic/board";
import { DiceValue } from "./game-logic/dice";
import { PlayerBoardPosition } from "./game-logic/player";
import { useNewgame } from "./game-logic/useKnucklebonesGame";
import { unwrapOr, contains, isSome, flatMap } from "./utils/optional";

function rnd(min: DiceValue, max: DiceValue): DiceValue {
	// min and max included
	return Math.floor(Math.random() * (max - min + 1) + min) as DiceValue;
}

function App() {
	const game = useNewgame();

	useEffect(() => {
		game.start(["Marcos", "Rome"]);
	}, []);

	useEffect(() => {
		if (contains(game.currentPlayer, PlayerBoardPosition.TOP)) {
			const nextValidMove = flatMap(game.getBoard(), (b) => getNextValidMove(b.top, 1));
			if (isSome(nextValidMove)) {
				setTimeout(() => {
					game.moveTopPlayer(nextValidMove.unwrap(), 6);
				}, 200);
			}
		}
	}, [game]);

	const onSelect = (player: PlayerBoardPosition) => (cell: CellId) => {
		if (player === "top") {
			game.moveTopPlayer(cell, rnd(1, 6));
		} else {
			game.moveBottomPlayer(cell, rnd(1, 6));
		}
	};

	const winner = game.getWinner().map((w) => `${w} wins 🎉`);

	const gameBoard = game.getBoard().map((b) => {
		const players = game.players.unwrap();
		return (
			<>
				<h1>{unwrapOr("", winner)}</h1>
				{Object.values(PlayerBoardPosition).map((pos) => (
					<Board
						debug
						key={pos}
						enabled={contains(game.currentPlayer, pos)}
						position={pos}
						player={players[pos]}
						board={b[pos]}
						onSelect={onSelect(pos)}
					/>
				))}
			</>
		);
	});

	return <>{unwrapOr(<></>, gameBoard)}</>;
}

export default App;
