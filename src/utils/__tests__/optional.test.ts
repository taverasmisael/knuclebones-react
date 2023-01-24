import { describe, it, test, expect } from "vitest";
import { Optional, Some, None, isNone, isSome, map, unwrapOr, contains } from "../optional";

describe("Optional types", () => {
	describe("isSome", () => {
		it("should return true for Some", () => {
			expect(isSome(Some(1))).toBe(true);
		});
		it("should return false for None", () => {
			expect(isSome(None())).toBe(false);
		});
	});

	describe("isNone", () => {
		it("should return true for None", () => {
			expect(isNone(None())).toBe(true);
		});
		it("should return false for Some", () => {
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
		it("should be Some", () => {
			expect(isSome(Some(1))).toBe(true);
		});
	});
	describe("None", () => {
		it("should be None", () => {
			expect(isNone(None())).toBe(true);
		});
	});

	describe("map", () => {
		const addOne = (x: number) => x + 1;
		it("should map Some values", () => {
			expect(isSome(map(Some(1), addOne))).toBe(true);
		});
		it("mapping over none always return none", () => {
			expect(isNone(map(None(), addOne))).toBe(true);
		});
	});

	describe("Optional", () => {
		it("should return Some", () => {
			expect(isSome(Optional(1))).toBe(true);
		});
		it("should return None", () => {
			expect(isNone(Optional(null))).toBe(true);
		});
	});
});
