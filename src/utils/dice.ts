import { DiceValue } from "../game-logic/dice";

// min and max included
export function rnd<T extends number>(min: T, max: T): T {
	if (max < min) throw new Error("max cannot be less than min");
	return Math.floor(Math.random() * (max - min + 1) + min) as T;
}

export function rollDice(): DiceValue {
	return rnd<DiceValue>(1, 6);
}
