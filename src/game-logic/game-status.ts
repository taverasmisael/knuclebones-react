import { Optional, None, Some } from "../utils/optional";
import { createEmptyBoard, Board } from "./board";
import { PairOfPlayers, PlayerBoardPosition, PlayerId } from "./player";

export enum GameStateTypes {
	GAME_RUNNING = "GAME_RUNNING",
	GAME_OVER = "GAME_OVER",
	GAME_NOT_STARTED = "GAME_NOT_STARTED",
}

export type ScoreBoard = Record<PlayerBoardPosition, number>;
export type GamePlayer = {
	name: string;
	score: number;
};
export type PlayerRecord = Record<PlayerBoardPosition, GamePlayer>;

export interface GameState {
	readonly _type: GameStateTypes;
	board: Optional<Board>;
	currentPlayer: Optional<PlayerBoardPosition>;
	players: Optional<PlayerRecord>;
	winner: Optional<PlayerId>;
}

export interface GameRunning extends GameState {
	readonly _type: GameStateTypes.GAME_RUNNING;
	board: Some<Board>;
	currentPlayer: Some<PlayerBoardPosition>;
	players: Some<PlayerRecord>;
	winner: None;
}

export interface GameOver extends GameState {
	readonly _type: GameStateTypes.GAME_OVER;
	board: Some<Board>;
	currentPlayer: None;
	winner: Some<PlayerBoardPosition>;
	players: Some<PlayerRecord>;
}

export interface GameNotStarted extends GameState {
	readonly _type: GameStateTypes.GAME_NOT_STARTED;
	board: None;
	currentPlayer: None;
	winner: None;
	players: None;
}

export type GameStatus = GameRunning | GameOver | GameNotStarted;

export function createNewGameRunning(
	players: PairOfPlayers,
	firstPlayer?: PlayerBoardPosition,
): GameRunning {
	const gameState = createNewGameNotStarted();
	return {
		...gameState,
		_type: GameStateTypes.GAME_RUNNING,
		board: Some(createEmptyBoard()),
		currentPlayer: Some(firstPlayer || PlayerBoardPosition.BOTTOM),
		players: Some({
			[PlayerBoardPosition.TOP]: {
				name: players[0],
				score: 0,
			},
			[PlayerBoardPosition.BOTTOM]: {
				name: players[1],
				score: 0,
			},
		}),
	};
}

export function createNewGameOver(
	gameState: GameRunning,
	winner: PlayerBoardPosition,
): GameOver | GameRunning {
	return {
		...gameState,
		_type: GameStateTypes.GAME_OVER,
		winner: Some(winner),
		currentPlayer: None(),
	};
}

export function createNewGameNotStarted(): GameNotStarted {
	return {
		_type: GameStateTypes.GAME_NOT_STARTED,
		board: None(),
		currentPlayer: None(),
		winner: None(),
		players: None(),
	};
}

// Helpers
export const isGameRunning = (gs: GameState): gs is GameRunning =>
	gs._type === GameStateTypes.GAME_RUNNING;

export const isGameOver = (gs: GameState): gs is GameOver => gs._type === GameStateTypes.GAME_OVER;

export const isGameNotStarted = (gs: GameState): gs is GameNotStarted =>
	gs._type === GameStateTypes.GAME_NOT_STARTED;
