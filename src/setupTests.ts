import { expect } from "vitest";
import { isNone, isSome, Optional } from "./utils/optional";

interface CustomMatchers<R = unknown> {
	toBeNone(): R;
	toBeSome<T>(expected: T): R;
}

declare global {
	namespace Vi {
		interface Assertion extends CustomMatchers {}
		interface AsymmetricMatchersContaining extends CustomMatchers {}
	}
}

expect.extend({
	toBeNone(received) {
		if (isNone(received)) {
			return {
				message: () => `expected ${received} to be None()`,
				pass: true,
				actual: received,
				expected: "None()",
			};
		} else {
			return {
				message: () => `expected ${received} to be None()`,
				pass: false,
				actual: received,
				expected: "None()",
			};
		}
	},
	toBeSome<T>(received: Optional<T>, expected: T) {
		if (isSome(received)) {
			if (received.unwrap() === expected) {
				return {
					message: () => `expected ${received} to be Some(${expected})`,
					pass: true,
					actual: received.unwrap(),
					expected,
				};
			} else {
				return {
					message: () => `expected "${received.unwrap()}" to be "${expected}"`,
					pass: false,
					actual: received.unwrap(),
					expected,
				};
			}
		} else {
			return {
				message: () => `expected ${received} to be Some(${expected})`,
				pass: false,
				actual: received,
				expected,
			};
		}
	},
});
