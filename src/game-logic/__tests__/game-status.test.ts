import { describe, test, expect } from "vitest";
import { isNone } from "../../utils/optional";
import {
	createNewGameNotStarted,
	createNewGameOver,
	createNewGameRunning,
	isGameRunning,
	isGameOver,
	isGameNotStarted,
} from "../game-status";
import { PlayerBoardPosition } from "../player";

describe("game-status", () => {
	const players = ["player1", "player2"] as [string, string];
	test("creatNewGameNotStarted", () => {
		const actual = createNewGameNotStarted();
		expect(isNone(actual.winner)).toBe(true);
		expect(actual).toMatchSnapshot();
	});

	test("createNewGameRunning", () => {
		const actual = createNewGameRunning(players);
		expect(isNone(actual.winner)).toBe(true);
		expect(actual).toMatchSnapshot();
	});

	test("createNewGameOver (P1 winner)", () => {
		const actual = createNewGameOver(createNewGameRunning(players), PlayerBoardPosition.BOTTOM);
		expect(actual.winner.unwrap()).toBe(PlayerBoardPosition.BOTTOM);
		expect(actual).toMatchSnapshot();
	});

	test("createNewGameOver (P2 winner)", () => {
		const actual = createNewGameOver(createNewGameRunning(players), PlayerBoardPosition.TOP);
		expect(actual.winner.unwrap()).toBe(PlayerBoardPosition.TOP);
		expect(actual).toMatchSnapshot();
	});

	describe("helpers", () => {
		test("isGameNotStarted", () => {
			const actual = isGameNotStarted(createNewGameNotStarted());
			expect(actual).toBe(true);
			expect(isGameNotStarted(createNewGameRunning(players))).toBe(false);
		});

		test("isGameRunning", () => {
			const actual = isGameRunning(createNewGameRunning(players));
			expect(actual).toBe(true);
			expect(isGameRunning(createNewGameNotStarted())).toBe(false);
		});

		test("isGameOver", () => {
			const actual = isGameOver(
				createNewGameOver(createNewGameRunning(players), PlayerBoardPosition.TOP),
			);
			expect(actual).toBe(true);
			expect(isGameOver(createNewGameRunning(players))).toBe(false);
		});
	});
});
