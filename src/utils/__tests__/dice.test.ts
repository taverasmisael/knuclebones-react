import { describe, test, expect } from "vitest";
import { rnd, rollDice } from "../dice";

describe("dice utilities", () => {
	describe("rnd: random number generator (min and max included)", () => {
		test.each([
			{ min: 0, max: 2 },
			{ min: 1, max: 3 },
			{ min: 2, max: 4 },
			{ min: 23, max: 54 },
			{ min: 4, max: 6 },
			// META TESTING WTF
			{ min: rnd(3, 9), max: rnd(10, 20) },
		])("rnd($min, $max)", ({ min, max }) => {
			const result = rnd(min, max);
			expect(result).toBeGreaterThanOrEqual(min);
			expect(result).toBeLessThanOrEqual(max);
		});

		test("rnd(0, 0) should return 0", () => {
			const result = rnd(0, 0);
			expect(result).toBe(0);
		});
		test("max cannot be less than min", () => {
			expect(() => rnd(1, 0)).toThrowError('max cannot be less than min')
		});
	});

	describe("rollDice: should return a random number between 1 and 6", () => {
		test.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])("rollDice() #%#", () => {
			const result = rollDice();
			expect(result).toBeGreaterThanOrEqual(1);
			expect(result).toBeLessThanOrEqual(6);
		});
	});
});
