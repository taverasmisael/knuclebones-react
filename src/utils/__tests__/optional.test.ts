import { describe, test, expect } from "vitest";
import { Optional, Some, None, isNone, isSome, map, unwrapOr, contains } from "../optional";

describe("Optional types", () => {
	describe("isSome", () => {
		test("should return true for Some", () => {
			expect(isSome(Some(1))).toBe(true);
		});
		test("should return false for None", () => {
			expect(isSome(None())).toBe(false);
		});
	});

	describe("isNone", () => {
		test("should return true for None", () => {
			expect(isNone(None())).toBe(true);
		});
		test("should return false for Some", () => {
			expect(isNone(Some(1))).toBe(false);
		});
	});

	describe("unwrapOr", () => {
		test("should return the value for Some", () => {
			expect(unwrapOr(Some(1), 2)).toBe(1);
		});

		test("should return the default value for None", () => {
			expect(unwrapOr(None(), 2)).toBe(2);
		});
	});

	describe("contains", () => {
		test("should return true if the value is Some and the value is the same", () => {
			expect(contains(Some(1), 1)).toBe(true);
		});
		test("should return false if the value is Some and the value is not the same", () => {
			expect(contains(Some(1), 2)).toBe(false);
		});
		test("should return false if the value is None", () => {
			expect(contains(None(), 2)).toBe(false);
		});
	});

	describe("Some", () => {
		test("should be Some", () => {
			expect(Some("Hello")).toBeSome('Hello');
		});
		test('you can unwap a some', () => {
			expect(Some('Hello').unwrap()).toBe('Hello');
		})
	});
	describe("None", () => {
		test("should be None", () => {
			expect(None()).toBeNone();
		});

		test('unwrapping a None throws', () => {
			expect(() => None().unwrap()).toThrow();
		})
	});

	describe("map", () => {
		const addOne = (x: number) => x + 1;
		test("should map Some values", () => {
			expect(map(Some(1), addOne)).toBeSome(2);
		});
		test("mapping over none always return none", () => {
			expect(map(None(), addOne)).toBeNone()
		});
	});

	describe("Optional", () => {
		test("should return Some", () => {
			expect(isSome(Optional(1))).toBe(true);
		});
		test("should return None", () => {
			expect(isNone(Optional(null))).toBe(true);
		});
	});
});
