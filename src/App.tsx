import { useEffect } from "react";
import "./App.css";
import { Board } from "./components/board";
import { CellId, getNextValidMove } from "./game-logic/board";
import { DiceValue } from "./game-logic/dice";
import { PlayerBoardPosition } from "./game-logic/player";
import { useNewgame } from "./game-logic/useKnucklebonesGame";
import { rollDice } from "./utils/dice";
import { unwrapOr, contains, isSome, flatMap } from "./utils/optional";

function App() {
	const game = useNewgame();

	useEffect(() => {
		game.start(["Marcos", "Rome"]);
	}, []);

	useEffect(() => {
		if (contains(game.currentPlayer, PlayerBoardPosition.TOP)) {
			const nextValidMove = flatMap(game.getBoard(), (b) => getNextValidMove(b.top));
			if (isSome(nextValidMove)) {
				setTimeout(() => {
					game.moveTopPlayer(nextValidMove.unwrap(), rollDice());
				}, 200);
			}
		}
	}, [game]);

	const onSelect = (player: PlayerBoardPosition) => (cell: CellId, value: DiceValue) => {
		if (player === "top") {
			game.moveTopPlayer(cell, value);
		} else {
			game.moveBottomPlayer(cell, value);
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
