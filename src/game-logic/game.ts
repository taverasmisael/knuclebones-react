import type { Optional } from "../utils/optional";
import { Board, CellId } from "./board";
import { DiceValue } from "./dice";
import { createNewGameRunning, createNewGameNotStarted, GameState } from "./game-status";
import { PairOfPlayers, PlayerBoardPosition } from "./player";
import { canPlayerMove, checkForWinner, makeMove } from "../utils/game-helpers";

type MakeMove = (cell: CellId, diceValue: DiceValue) => KnucklebonesGame;

export interface KnucklebonesGame {
	getGameStatus: () => GameState;
	getBoard: () => Optional<Board>;
	start: (players: PairOfPlayers, currentPlayer?: PlayerBoardPosition) => KnucklebonesGame;
	moveTopPlayer: MakeMove;
	moveBottomPlayer: MakeMove;
}

export function newGame(gs?: GameState): KnucklebonesGame {
	const gameStatus: GameState = gs || createNewGameNotStarted();
	const move = (
		player: PlayerBoardPosition,
		cell: CellId,
		diceValue: DiceValue,
	): KnucklebonesGame => {
		if (!canPlayerMove(player, gameStatus)) throw new Error("Not your turn");
		return newGame(checkForWinner(makeMove(player, cell, diceValue, gameStatus)));
	};

	return {
		getGameStatus: () => gameStatus,
		getBoard: () => gameStatus.board,
		moveTopPlayer: (cell: CellId, diceValue: DiceValue) =>
			move(PlayerBoardPosition.TOP, cell, diceValue),
		moveBottomPlayer: (cell: CellId, diceValue: DiceValue) =>
			move(PlayerBoardPosition.BOTTOM, cell, diceValue),
		start: (players: PairOfPlayers, currentPlayer?: PlayerBoardPosition) =>
			newGame(createNewGameRunning(players, currentPlayer)),
	};
}
