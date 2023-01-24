import { describe, test, expect } from 'vitest'
import { newGame } from '../game'

describe('Game logic', () => {
  test('a new game has an empty board', () => {
    const actual = newGame()
    expect(actual.getBoard()).toMatchSnapshot()
  })

  test('you can start a new game', () => {
    const actual = newGame().start(['player1', 'player2'])
    expect(actual.getBoard()).toMatchSnapshot()
  })
})
