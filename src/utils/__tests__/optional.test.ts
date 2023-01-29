import { describe, test, expect } from "vitest";
import {
	Optional,
	Some,
	None,
	isNone,
	isSome,
	unwrapOr,
	contains,
	flatMap,
	flat,
} from "../optional";

describe("Optional types", () => {
	describe("constructors", () => {
		describe("Some", () => {
			test("should be Some", () => {
				expect(Some("Hello")).toBeSome("Hello");
			});
			test("you can unwap a some", () => {
				expect(Some("Hello").unwrap()).toBe("Hello");
			});
			test("map over a returns a Some with the mapped value", () => {
				expect(Some("Hello").map((x) => x.length)).toBeSome(5);
			});
		});
		describe("None", () => {
			test("should be None", () => {
				expect(None()).toBeNone();
			});

			test("unwrapping a None throws", () => {
				expect(() => None().unwrap()).toThrow();
			});

			test("to map over a None returns a None", () => {
				expect(None().map((x) => x)).toBeNone();
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

	describe("helpers", () => {
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
				expect(unwrapOr(2, Some(1))).toBe(1);
			});

			test("should return the default value for None", () => {
				expect(unwrapOr(2, None())).toBe(2);
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

		describe("flat", () => {
			test("should unest one level Some", () => {
				expect(flat(Some(Some(1)))).toBeSome(1);
				// Triple nesting is unested to double nesting
				expect(flat(Some(Some(Some(1)))).toString()).toBe(Some(Some(1)).toString());
			});
			test("should return a None", () => {
				expect(flat(Some(None()))).toBeNone();
				expect(flat(None())).toBeNone();
			});
		});

		describe("flatMap", () => {
			test("if the mapping function returns a Some, it auto flattens it one level", () => {
				expect(flatMap(Some(1), (x) => Some(x + 1))).toBeSome(2);
			});
			test("should return a None", () => {
				expect(flatMap(Some(1), () => None())).toBeNone();
				expect(flatMap(None(), () => None())).toBeNone();
			});
		});
	});
});
