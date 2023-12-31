import { describe, expect, test } from "vitest";
import {
	Board,
	cellIdToCoordinate,
	createEmptyBoard,
	createEmptyBoardSlice,
	createFullBoardSlice,
	getValueOnCoordinates,
} from "../../game-logic/board";
import { GameState, GameStateTypes, isGameOver } from "../../game-logic/game-status";
import { PlayerBoardPosition } from "../../game-logic/player";
import { canPlayerMove, checkForWinner, makeMove } from "../game-helpers";
import { None, Some } from "../optional";
import { calculateBoardScore } from "../../game-logic/board";

const defaultPlayers = Some({
	[PlayerBoardPosition.TOP]: { name: "A", score: 0 },
	[PlayerBoardPosition.BOTTOM]: { name: "B", score: 0 },
});

describe("canPlayerMove", () => {
	test("should return true if the player is the current player", () => {
		expect(
			canPlayerMove(PlayerBoardPosition.TOP, {
				currentPlayer: Some(PlayerBoardPosition.TOP),
				_type: GameStateTypes.GAME_RUNNING,
			} as GameState),
		).toBe(true);
	});
	test("should return false if the player is NOT the current player", () => {
		expect(
			canPlayerMove(PlayerBoardPosition.TOP, {
				currentPlayer: Some(PlayerBoardPosition.BOTTOM),
				_type: GameStateTypes.GAME_RUNNING,
			} as GameState),
		).toBe(false);
	});
	test("should return false if game is not running", () => {
		expect(
			canPlayerMove(PlayerBoardPosition.TOP, {
				currentPlayer: Some(PlayerBoardPosition.TOP),
				_type: GameStateTypes.GAME_OVER,
			} as GameState),
		).toBe(false);
	});
});
describe("makeMove", () => {
	test("should return a game state with the new board and the next player", () => {
		const gs = {
			_type: GameStateTypes.GAME_RUNNING,
			currentPlayer: Some(PlayerBoardPosition.TOP),
			board: Some(createEmptyBoard()),
			players: defaultPlayers,
			winner: None(),
		} satisfies GameState;
		const cellId = "2-0";
		const coords = cellIdToCoordinate(cellId);
		const actual = makeMove(PlayerBoardPosition.TOP, cellId, 2, gs);
		expect(actual.board).not.toBe(gs.board);
		expect(
			getValueOnCoordinates(actual.board.unwrap(), PlayerBoardPosition.TOP, coords).value,
		).toBeSome(2);
		expect(actual.currentPlayer).not.toBe(gs.currentPlayer);
		expect(actual.currentPlayer).toBeSome(PlayerBoardPosition.BOTTOM);
	});
});

describe("checkForWinner", () => {
	test(`should return a game state of type ${GameStateTypes.GAME_OVER} if there's a winner`, () => {
		const topBoard = createFullBoardSlice(6);
		const gs = {
			_type: GameStateTypes.GAME_RUNNING,
			currentPlayer: None(),
			board: Some<Board>({
				top: topBoard,
				bottom: createEmptyBoardSlice(),
			}),
			players: Some({
				[PlayerBoardPosition.TOP]: { name: "A", score: calculateBoardScore(topBoard) },
				[PlayerBoardPosition.BOTTOM]: { name: "B", score: 0 },
			}),
			winner: None(),
		} satisfies GameState;
		const actual = checkForWinner(gs);
		expect(isGameOver(actual)).toBe(true);
		expect(actual.winner).toBeSome(gs.players.value.top.name);
	});

	describe("should return the same game state if", () => {
		test("the game is not running", () => {
			const gs = {
				_type: GameStateTypes.GAME_OVER,
				currentPlayer: None(),
				board: Some<Board>({ top: createFullBoardSlice(), bottom: [] }),
				players: defaultPlayers,
				winner: None(),
			} satisfies GameState;
			const actual = checkForWinner(gs);
			expect(actual).toBe(gs);
		});
		test("the game has no board", () => {
			const gs = {
				_type: GameStateTypes.GAME_RUNNING,
				currentPlayer: None(),
				board: None(),
				players: defaultPlayers,
				winner: None(),
			} satisfies GameState;
			const actual = checkForWinner(gs);
			expect(actual).toBe(gs);
		});
		test("the game has no players", () => {
			const gs = {
				_type: GameStateTypes.GAME_RUNNING,
				currentPlayer: None(),
				board: Some<Board>({ top: createFullBoardSlice(), bottom: [] }),
				players: None(),
				winner: None(),
			} satisfies GameState;
			const actual = checkForWinner(gs);
			expect(actual).toBe(gs);
		});
		test("the game board is not full", () => {
			const gs = {
				_type: GameStateTypes.GAME_RUNNING,
				currentPlayer: None(),
				board: Some(createEmptyBoard()),
				players: defaultPlayers,
				winner: None(),
			} satisfies GameState;
			const actual = checkForWinner(gs);
			expect(actual).toBe(gs);
		});
	});
});
