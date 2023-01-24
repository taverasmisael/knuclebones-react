import type { Optional } from '../utils/optional'
import { Board, BoardCoordinate } from './board'
import { DiceValue } from './dice'
import {
  createNewGameRunning,
  createNewGameNotStarted,
  GameState,
} from './game-status'
import { PlayerBoardPosition, PlayerId } from './player'
import { canPlayerMove, checkForWinner, makeMove } from '../utils/game-helpers'

export interface KnucklebonesGame {
  getGameStatus: () => GameState
  getBoard: () => Optional<Board>
  start: (players: [PlayerId, PlayerId]) => KnucklebonesGame
  moveTopPlayer: (
    coordinate: BoardCoordinate,
    diceValue: DiceValue
  ) => KnucklebonesGame
  moveBottomPlayer: (
    coordinate: BoardCoordinate,
    diceValue: DiceValue
  ) => KnucklebonesGame
}

export function newGame(gs?: GameState): KnucklebonesGame {
  const gameStatus: GameState = gs || createNewGameNotStarted()
  const move = (
    player: PlayerBoardPosition,
    coords: BoardCoordinate,
    diceValue: DiceValue
  ): KnucklebonesGame => {
    if (!canPlayerMove(player, gameStatus)) throw new Error('Not your turn')
    return newGame(
      checkForWinner(makeMove(player, coords, diceValue, gameStatus))
    )
  }

  return {
    getGameStatus: () => gameStatus,
    getBoard: () => gameStatus.board,
    moveTopPlayer: (cords: BoardCoordinate, diceValue: DiceValue) =>
      move(PlayerBoardPosition.TOP, cords, diceValue),
    moveBottomPlayer: (cords: BoardCoordinate, diceValue: DiceValue) =>
      move(PlayerBoardPosition.BOTTOM, cords, diceValue),
    start: (players: [PlayerId, PlayerId]) =>
      newGame(createNewGameRunning(players)),
  }
}
