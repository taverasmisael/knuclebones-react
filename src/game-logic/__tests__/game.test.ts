import { describe, test, expect } from 'vitest'
import { newGame } from '../game'
import { PlayerBoardPosition } from '../player'

describe('Game logic', () => {
  test('a new game has an empty board', () => {
    const actual = newGame()
    expect(actual.getBoard()).toMatchSnapshot()
  })

  test('you can start a new game', () => {
    const actual = newGame().start(['player1', 'player2'])
    expect(actual.getBoard()).toMatchSnapshot()
  })

  test('bottom player can make a move', () => {
    const actual = newGame()
      .start(['player1', 'player2'])
      .moveBottomPlayer([2, 1], 3)
    expect(actual.getBoard()).toMatchSnapshot()
  })

  test('top player can make a move', () => {
    const actual = newGame()
      .start(['player1', 'player2'], PlayerBoardPosition.TOP)
      .moveTopPlayer([2, 1], 3)
    expect(actual.getBoard()).toMatchSnapshot()
  })
})
