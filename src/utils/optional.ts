interface toJSON {
	toJSON(): string;
	toString(): string;
}
interface Maybe<T> extends toJSON {
	readonly _type: "SOME" | "NONE";
	value?: T;
	unwrap(): T;
	map<R>(fn: (value: T) => R): Optional<R>;
}

export interface Some<T> extends Maybe<T> {
	readonly _type: "SOME";
	value: T;
}
export interface None extends Maybe<never> {
	readonly _type: "NONE";
}
export type Optional<T> = Some<T> | None;
type NonNullable = string | number | boolean | symbol | object;

export function Optional<T>(value: T): Optional<T> {
	if (value == null) {
		return None();
	}
	return Some(value);
}

export function isNone<T>(value: Optional<T>): value is None {
	return value._type === "NONE";
}

export function isSome<T>(value: Optional<T>): value is Some<T> {
	return value._type === "SOME";
}

export function map<T, R>(value: Optional<T>, fn: (value: T) => R): Optional<R> {
	if (isNone(value)) {
		return None();
	}

	return Optional(fn(value.value));
}

export function Some<T extends NonNullable>(value: T): Some<T> {
	return {
		_type: "SOME",
		value,
		unwrap: () => value,
		map: (fn) => Optional(fn(value)),
		toJSON: () => `Some(${JSON.stringify(value)})`,
		toString: () => `Some(${JSON.stringify(value)})`,
	};
}

export function None(): None {
	return {
		_type: "NONE",
		unwrap: () => {
			throw new Error("Cannot unwrap None");
		},
		map: () => None(),
		toJSON: () => "None()",
		toString: () => "None()",
	};
}

// helpers
export function unwrapOr<T>(value: Optional<T>, defaultValue: T): T {
	if (isNone(value)) {
		return defaultValue;
	}
	return value.unwrap();
}

export function contains<T>(value: Optional<T>, search: T): boolean {
	if (isNone(value)) {
		return false;
	}
	return value.value === search;
}
