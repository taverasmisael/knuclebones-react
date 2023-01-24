import { describe, test, expect } from 'vitest'
import { isNone, isSome } from '../../utils/optional'
import {
  createEmptyBoard,
  createFullBoard,
  getValueOnCoordinates,
  makeMoveOnBoard,
  createEmptyBoardSlice,
  createFullBoardSlice,
} from '../board'
import { PlayerBoardPosition } from '../player'

describe('board', () => {
  describe('createEmptyBoard', () => {
    test('should create 2 3x3 grids one for each player', () => {
      const actual = createEmptyBoard()
      expect(actual.top).toHaveLength(3)
      expect(actual.bottom).toHaveLength(3)

      expect(actual.top.flat().filter(isNone)).toHaveLength(
        actual.bottom.flat().filter(isNone).length
      )
    })
  })

  describe('helpers', () => {
    test('createEmptyBoardSlice: should create a 3x3 grid of None()s', () => {
      const actual = createEmptyBoardSlice()
      expect(actual).toHaveLength(3)
      expect(actual.flat().filter(isNone)).toHaveLength(9)
    })

    test('createFullBoardSlice: should create a 3x3 grid of Some(1)s', () => {
      const actual = createFullBoardSlice()
      expect(actual).toHaveLength(3)
      expect(actual.flat().filter(isSome)).toHaveLength(9)
    })

    test('getValueOnCoordinates: should return the value on the given coordinates', () => {
      const board = {
        top: createFullBoardSlice(),
        bottom: createEmptyBoardSlice(),
      }
      const actual = getValueOnCoordinates(
        board,
        PlayerBoardPosition.TOP,
        [0, 0]
      )
      expect(actual.unwrap()).toBe(1)
    })

    test('getValueOnCoordinates: should return None() if the coordinates are out of bounds', () => {
      const board = createFullBoard();
      const actual = getValueOnCoordinates(board, PlayerBoardPosition.TOP, [4, 9] as any)
      expect(isNone(actual)).toBe(true)
    })

    test('createFullBoard: should create a full board', () => {
      const actual = createFullBoard()
      expect(actual.top.flat().filter(isSome)).toHaveLength(9)
      expect(actual.bottom.flat().filter(isSome)).toHaveLength(9)
    })
  })

  describe('makeMoveOnBoard', () => {
    test('any player can make moves on their side (top)', () => {
      const board = createEmptyBoard()
      const actual = makeMoveOnBoard(board, 'top', [0, 0], 1)
      expect(actual.top[0][0].unwrap()).toBe(1)
      expect(() => actual.top[1][0].unwrap()).toThrow()
    })

    test('any player can make moves on their side (bottom)', () => {
      const board = createEmptyBoard()
      const actual = makeMoveOnBoard(board, 'bottom', [0, 0], 5)
      expect(actual.bottom[0][0].unwrap()).toBe(5)
      expect(() => actual.top[0][0].unwrap()).toThrow()
    })

    test('should throw if the cell is already played', () => {
      const board = createEmptyBoard()
      const actual = makeMoveOnBoard(board, 'top', [0, 0], 1)
      expect(() => makeMoveOnBoard(actual, 'top', [0, 0], 1)).toThrow()
    })
  })
})
