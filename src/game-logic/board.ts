import { pathOr } from 'rambda'
import { produce } from 'immer'
import { isSome, None, Optional, Some } from '../utils/optional'
import { DiceValue } from './dice'
import { PlayerId, PlayerBoardPosition } from './player'

type BoardPosition = 0 | 1 | 2
export type BoardCoordinate = [BoardPosition, BoardPosition]
export interface Board {
  top: Optional<DiceValue>[][]
  bottom: Optional<DiceValue>[][]
}

export interface GameBoard {
  board: Board
  makeMove(
    player: PlayerId,
    row: number,
    column: number,
    value: DiceValue
  ): Board
}

export function createEmptyBoard(): Board {
  return {
    top: createEmptyBoardSlice(),
    bottom: createEmptyBoardSlice(),
  }
}

export function createFullBoard(): Board {
  return {
    top: createFullBoardSlice(),
    bottom: createFullBoardSlice(),
  }
}

export function getValueOnCoordinates(
  board: Board,
  position: PlayerBoardPosition,
  coordinate: BoardCoordinate
): Optional<DiceValue> {
  return pathOr(None(), [position, ...coordinate], board)
}

export function createFullBoardSlice(): Optional<DiceValue>[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => Some(1))
  )
}

export function createEmptyBoardSlice(): Optional<DiceValue>[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => None())
  )
}

export function makeMoveOnBoard(
  board: Board,
  position: PlayerBoardPosition,
  coordinate: [number, number],
  value: DiceValue
): Board {
  return produce(board, (draft) => {
    const [row, column] = coordinate
    const cell = draft[position][row][column]
    if (isSome(cell)) throw new Error('Cell already played')
    draft[position][row][column] = Some(value)
  })
}
