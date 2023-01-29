import { describe, test, expect } from "vitest";
import { reduce, flatten, pipe, filter, range } from "rambda";
import { contains, isNone, isSome, None, Some } from "../../utils/optional";
import {
	createEmptyBoard,
	createFullBoard,
	getValueOnCoordinates,
	makeMoveOnBoard,
	createEmptyBoardSlice,
	createFullBoardSlice,
	BoardValue,
	Board,
	cellIdToCoordinate,
	CellId,
	BoardPosition,
	getNextValidMove,
	calculateColumnScore,
	calculateBoardScore,
} from "../board";
import { PlayerBoardPosition } from "../player";
import produce from "immer";
import { DiceValue } from "../dice";

const getEnabledIds = pipe(
	flatten,
	reduce((acc, c: BoardValue) => (c.enabled ? [...acc, c.id] : acc), [] as string[]),
);

const getEmptyCells = pipe(
	flatten,
	filter((c: BoardValue) => isNone(c.value)),
);

const getFullCells = pipe(
	flatten,
	filter((c: BoardValue) => isSome(c.value)),
);

describe("createEmptyBoard", () => {
	test("should create 2 3x3 grids one for each player", () => {
		const actual = createEmptyBoard();
		expect(actual.top).toHaveLength(3);
		expect(actual.bottom).toHaveLength(3);

		expect(getEmptyCells(actual.top)).toHaveLength(getEmptyCells(actual.bottom).length);
	});

	test('top and bottom should have the same ids "enable"', () => {
		const board = createEmptyBoard();
		const actualTop = getEnabledIds(board.top);
		const actualBottom = getEnabledIds(board.bottom);

		expect(actualTop).toHaveLength(3);
		expect(actualTop).toEqual(actualBottom);
	});
});

describe("helpers", () => {
	test("cellIdToCoordinate: should return the coordinate for the given id", () => {
		const actual = (["0-0", "0-1", "2-2", "1-2", "2-0"] satisfies CellId[]).map(cellIdToCoordinate);
		expect(actual).toEqual([
			[0, 0],
			[0, 1],
			[2, 2],
			[1, 2],
			[2, 0],
		]);
	});

	test("createEmptyBoardSlice: should create a 3x3 grid of None()s", () => {
		const actual = createEmptyBoardSlice();
		expect(actual).toHaveLength(3);
		expect(getEmptyCells(actual)).toHaveLength(9);
		expect(getEnabledIds(actual)).toEqual(["0-0", "1-0", "2-0"]);
	});

	test("createFullBoardSlice: should create a 3x3 grid of Some(1)s (default)", () => {
		const actual = createFullBoardSlice();
		expect(actual).toHaveLength(3);
		expect(getFullCells(actual)).toHaveLength(9);
		// Full board should not have any enabled cells
		expect(getEnabledIds(actual)).toHaveLength(0);
	});
	test("createFullBoardSlice: should create a 3x3 grid of Some(<value>)s", () => {
		const actual = createFullBoardSlice(4);
		const fullCells = getFullCells(actual);
		expect(actual).toHaveLength(3);
		expect(fullCells).toHaveLength(9);
		expect(actual.flat().filter((c) => contains(c.value, 4))).toHaveLength(fullCells.length);
	});

	test("getValueOnCoordinates: should return the value on the given coordinates", () => {
		const board = {
			top: createFullBoardSlice(),
			bottom: createEmptyBoardSlice(),
		};
		const actual = getValueOnCoordinates(board, PlayerBoardPosition.TOP, [0, 0]);
		expect(actual.value).toBeSome(1);
	});

	test("getValueOnCoordinates: should return None() if the coordinates are out of bounds", () => {
		const board = createFullBoard();
		// rome-ignore lint/suspicious/noExplicitAny: Need an out of bounds coordinate
		const actual = getValueOnCoordinates(board, PlayerBoardPosition.TOP, [4, 9] as any);
		expect(actual).toBeNone();
	});

	test("createFullBoard: should create a full board", () => {
		const actual = createFullBoard();
		expect(getFullCells(actual.top)).toHaveLength(9);
		expect(getFullCells(actual.top)).toHaveLength(getFullCells(actual.bottom).length);
	});
});

describe("makeMoveOnBoard", () => {
	const boardCells = range(0, 3) as BoardPosition[];
	const board = createEmptyBoard();

	test("any player can make legal moves on their side (top)", () => {
		const cellId = "2-0";
		const coords = cellIdToCoordinate(cellId);
		const actual = makeMoveOnBoard(board, PlayerBoardPosition.TOP, cellId, 1);
		expect(getValueOnCoordinates(actual, PlayerBoardPosition.TOP, coords).value).toBeSome(1);
		expect(getFullCells(actual.top)).toHaveLength(1);
		expect(getFullCells(actual.bottom)).toHaveLength(0);
	});

	test("any player can make moves on their side (bottom)", () => {
		const actual = makeMoveOnBoard(board, PlayerBoardPosition.BOTTOM, "0-0", 5);
		expect(getValueOnCoordinates(actual, PlayerBoardPosition.BOTTOM, [0, 0]).value).toBeSome(5);
		expect(getFullCells(actual.bottom)).toHaveLength(1);
		expect(getFullCells(actual.top)).toHaveLength(0);
	});

	test("should throw if the cell is already played", () => {
		const cellId = "1-0";
		const actual = makeMoveOnBoard(board, PlayerBoardPosition.TOP, cellId, 1);
		expect(() => makeMoveOnBoard(actual, PlayerBoardPosition.TOP, cellId, 1)).toThrow(/played/gi);
	});

	test("should throw if the cell is not enabled", () => {
		expect(() => makeMoveOnBoard(board, PlayerBoardPosition.TOP, "0-2", 1)).toThrow(
			/invalid move/gi,
		);
	});

	test("should enable the next row if all cells in the current row are played", () => {
		const actual = boardCells.reduce(
			(acc, i) => makeMoveOnBoard(acc, PlayerBoardPosition.BOTTOM, `${i}-0` satisfies CellId, 1),
			board,
		);

		expect(getEnabledIds(actual.bottom)).toEqual(["0-1", "1-1", "2-1"]);
	});

	test("should enable the next cell in column after a move", () => {
		const actual = makeMoveOnBoard(board, PlayerBoardPosition.BOTTOM, "0-0", 1);
		expect(getEnabledIds(actual.bottom)).toEqual(["0-1", "1-0", "2-0"]);
	});

	test("should not have any enabled cells after filling the board", () => {
		const fillRow = (acc: Board, row: BoardPosition) =>
			boardCells.reduce(
				(acc, i) => makeMoveOnBoard(acc, PlayerBoardPosition.BOTTOM, `${i}-${row}`, 1),
				acc,
			);
		const actual = boardCells.reduce(fillRow, board);

		expect(getEnabledIds(actual.bottom)).toHaveLength(0);
	});
});

describe("getNextValidMove", () => {
	test("should return the first available cell", () => {
		const board = createEmptyBoardSlice();
		const actual = getNextValidMove(board, 0);
		expect(actual).toBeSome("0-0");
	});

	test("should return None() if the board is full", () => {
		const board = createFullBoardSlice();
		const actual = getNextValidMove(board, 0);
		expect(actual).toBeNone();
	});

	test("should return the first valid move if the position passed is not valid but there are valid moves", () => {
		const board = produce(createFullBoardSlice(), (b) => {
			b[0][0] = {
				value: None(),
				enabled: true,
				id: "0-0",
			};
		});
		// asking for the Third cell, but the first cell is the only available
		const actual = getNextValidMove(board, 2);
		expect(actual).toBeSome("0-0");
	});
});

describe("getBoardScore", () => {
	describe("calculateColumnScore: should return the score of a column", () => {
		test.each<{ column: DiceValue[]; expected: number }>([
			{ column: [], expected: 0 },
			{ column: [1], expected: 1 },
			{ column: [1, 1], expected: 4 },
			{ column: [1, 1, 1], expected: 9 },
			{ column: [5, 5], expected: 20 },
			{ column: [6, 6, 6], expected: 54 },
			{ column: [4, 5, 4], expected: 21 },
		])("calculateColumnScore($column)->$expected ", ({ column, expected }) => {
			const col = column.map((v) => ({ value: Some(v) }));
			const actual = calculateColumnScore(col);
			expect(actual).toBe(expected);
		});
	});

	describe("calculateBoardScore: should return the score of a board slice", () => {
		test.each<{ board: DiceValue[][]; expected: number }>([
			{ board: [[], [], []], expected: 0 },
			{ board: [[], [], [1]], expected: 1 },
			{ board: [[], [1], [1]], expected: 2 },
			{ board: [[1], [1], [1]], expected: 3 },
			{ board: [[5, 5], [], []], expected: 20 },
			{ board: [[6, 6, 6], [], []], expected: 54 },
			{ board: [[4, 5, 4], [6, 6, 6], [1]], expected: 76 },
		])("calculateBoardScore($board)->$expected ", ({ board, expected }) => {
			const boardSlice = board.map((row) => row.map((v) => ({ value: Some(v) })));
			const actual = calculateBoardScore(boardSlice);
			expect(actual).toBe(expected);
		});
	});

	test("calculateBoardScore: an empty board is always 0", () => {
		const actual = calculateBoardScore(createEmptyBoardSlice());
		expect(actual).toBe(0);
	});

	test("calculateBoardScore: a full board (of 1s) is always 27", () => {
		const actual = calculateBoardScore(createFullBoardSlice());
		expect(actual).toBe(27);
	});

	test("calculateBoardScore: a full board (of 6s) is always 27", () => {
		const actual = calculateBoardScore(createFullBoardSlice(6));
		expect(actual).toBe(162);
	});
});
