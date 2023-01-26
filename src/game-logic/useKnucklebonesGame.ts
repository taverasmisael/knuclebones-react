import { compose } from "rambda";
import { useEffect, useState } from "react";
import type { KnucklebonesGame } from "./game";
import { newGame } from "./game";
import { GameState } from "./game-status";

interface UseNewKnuclebonesGame extends Omit<KnucklebonesGame, "getGameStatus"> {
	readonly players: GameState["players"];
	readonly currentPlayer: GameState["currentPlayer"];
}

export function useNewgame(): UseNewKnuclebonesGame {
	const [game, _setGame] = useState<KnucklebonesGame>(newGame());
	const setGame = (s: KnucklebonesGame): KnucklebonesGame => {
		_setGame(s);
		return s;
	};

	useEffect(() => {
		console.log(game.getGameStatus());
	}, [game]);

	return {
		// Need to update state
		moveBottomPlayer: compose(setGame, game.moveBottomPlayer),
		moveTopPlayer: compose(setGame, game.moveTopPlayer),
		start: compose(setGame, game.start),

		// Custom getters
		getBoard: game.getBoard,
		get players() {
			return game.getGameStatus().players;
		},
		get currentPlayer() {
			return game.getGameStatus().currentPlayer;
		},
	};
}
