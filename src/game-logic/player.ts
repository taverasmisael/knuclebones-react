export type PlayerId = string;
export type PlayerBoardPosition = "top" | "bottom";
const PlayerTop: PlayerBoardPosition = "top";
const PlayerBottom: PlayerBoardPosition = "bottom";
export const PlayerBoardPosition = {
	TOP: PlayerTop,
	BOTTOM: PlayerBottom,
};
export type PairOfPlayers = [PlayerId, PlayerId];
