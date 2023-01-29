import produce from "immer";
import { makeMoveOnBoard, Board, CellId } from "../game-logic/board";
import { DiceValue } from "../game-logic/dice";
import { GameState, isGameRunning, createNewGameOver } from "../game-logic/game-status";
import { PlayerBoardPosition } from "../game-logic/player";
import { isNone, Some, isSome } from "./optional";

export const makeMove = (
	player: PlayerBoardPosition,
	cellId: CellId,
	diceValue: DiceValue,
	gameStatus: GameState,
) =>
	produce(gameStatus, (gs: GameState) => {
		if (!isGameRunning(gs)) return;
		if (isNone(gs.currentPlayer)) return;
		gs.board = gs.board.map((b) => makeMoveOnBoard(b, player, cellId, diceValue)) as Some<Board>;
		gs.currentPlayer = gs.currentPlayer.map((_) =>
			player === PlayerBoardPosition.TOP ? PlayerBoardPosition.BOTTOM : PlayerBoardPosition.TOP,
		) as Some<PlayerBoardPosition>;
	});

export const canPlayerMove = (player: PlayerBoardPosition, gs: GameState): boolean => {
	if (!isGameRunning(gs)) return false;
	if (isNone(gs.currentPlayer)) return false;
	if (gs.currentPlayer.unwrap() !== player) return false;
	return true;
};

export const checkForWinner = (gs: GameState): GameState => {
	if (!isGameRunning(gs)) return gs;
	if (isNone(gs.board)) return gs;
	if (isNone(gs.players)) return gs;
	const board = gs.board.unwrap();
	const topFull = board.top.every((row) => row.every((cell) => isSome(cell.value)));
	const bottomFull = board.bottom.every((row) => row.every((cell) => isSome(cell.value)));
	if (topFull || bottomFull) {
		return createNewGameOver(gs, topFull ? PlayerBoardPosition.TOP : PlayerBoardPosition.BOTTOM);
	}
	return gs;
};
