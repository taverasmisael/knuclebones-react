import { useState, useEffect } from "react";
import "./App.css";
import { BoardCoordinate } from "./game-logic/board";
import { PlayerBoardPosition } from "./game-logic/player";
import { useNewgame } from "./game-logic/useKnucklebonesGame";
import { isSome } from "./utils/optional";

function App() {
	const game = useNewgame();
	const [clicksB, setClicksB] = useState(0);
	const [clicksT, setClicksT] = useState(0);
	useEffect(() => {
		game.start(["player1", "player2"]);
	}, []);
	const onBottomPlayerMove = () => {
		game.moveBottomPlayer([0, clicksB] as BoardCoordinate, 3);
		setClicksB((c) => Math.min(c + 1, 2));
	};
	const onTopPlayerMove = () => {
		game.moveTopPlayer([0, clicksT] as BoardCoordinate, 3);
		setClicksT((c) => Math.min(c + 1, 2));
	};

	return (
		<div className="App">
			<h1>Knucklebones</h1>
			<div className="card">
				<button
					onClick={onTopPlayerMove}
					disabled={
						isSome(game.currentPlayer) && game.currentPlayer.unwrap() !== PlayerBoardPosition.TOP
					}
				>
					Make top move
				</button>
				<pre>
					{JSON.stringify(
						game
							.getBoard()
							.map((b) =>
								[
									...b.top.map((d) => d.map((v) => (isSome(v) ? v.value : "EMPTY"))),
									...b.bottom.map((d) => d.map((v) => (isSome(v) ? v.value : "EMPTY"))),
								].join(""),
							),
					)}
				</pre>
				<button
					onClick={onBottomPlayerMove}
					disabled={
						isSome(game.currentPlayer) && game.currentPlayer.unwrap() !== PlayerBoardPosition.BOTTOM
					}
				>
					Make bottom move
				</button>
			</div>
		</div>
	);
}

export default App;
