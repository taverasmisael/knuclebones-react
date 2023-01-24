export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;
export interface DiceState {
	value: DiceValue;
	rolled: boolean;
	rolling: boolean;
}
