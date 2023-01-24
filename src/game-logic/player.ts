export type PlayerId = string
export type PlayerBoardPosition = 'top' | 'bottom'
export const PlayerBoardPosition = {
  TOP: 'top' as const,
  BOTTOM: 'bottom' as const,
}
export type PairOfPlayers = [PlayerId, PlayerId]
