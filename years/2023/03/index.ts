import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { Grid } from "../../../util/grid";
import { isNull, max, min } from "lodash";

const YEAR = 2023;
const DAY = 3;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\03\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\03\data.txt
// problem url  : https://adventofcode.com/2023/day/3

function checkAround(grid: string[], i: number, j: number, iMax: number, jMax: number) {
	for (let x = max([i - 1, 0]) || 0; x <= (min([i + 1, iMax]) || i + 1); x++) {
		for (let y = max([j - 1, 0]) || 0; y <= (min([j + 1, jMax]) || i + 1); y++) {
			if(!grid[x][y].match(/(\d|\.)/)) {
				return true;
			}
		}
	}
	return false;
}

async function p2023day3_part1(input: string, ...params: any[]) {
	let grid = input.split('\n');
	let numStart: number | null = null;
	let numEnd: number | null = null;
	let processNum = false;
	function reset() {
		numStart = null
		numEnd = null
		processNum = false
	}
	let sum = 0;

	for (let i = 0; i < grid.length; i++) {
		const row = grid[i];
		for (let j = 0; j < row.length; j++) {
			const character = row[j];
			if(character.match(/(\d)/)) {
				if(isNull(numStart)) {
					numStart = j;
				}
				processNum = processNum || checkAround(grid, i, j, grid.length - 1, row.length - 1);
			} else {
				numEnd = j;
				if(processNum && !isNull(numStart) && !isNull(numEnd)) {
					let num = +row.substring(numStart, numEnd);
					sum += num;
				}	
				reset()
			}
		}
		numEnd = row.length;
		if(row[row.length - 1].match(/(\d)/) && processNum && !isNull(numStart) && !isNull(numEnd)) {
			let num = +row.substring(numStart, numEnd);
			sum += num;
		}	
		reset()
	}

	return sum;
}

function safeSub(i: number) {
	return max([i - 1, 0]) || 0;
}
function safeAdd(i: number, m: number) {
	return min([i + 1, m]) || 0;
}
function checkAroundNum(grid: string[], i: number, j: number, iMax: number, jMax: number) {
	for (let x = max([i - 1, 0]) || 0; x <= (min([i + 1, iMax]) || i + 1); x++) {
		for (let y = max([j - 1, 0]) || 0; y <= (min([j + 1, jMax]) || i + 1); y++) {
			if(!grid[x][y].match(/(\d|\.)/)) {
				return true;
			}
		}
	}
	return false;
}

class Part {
	constructor(
		public val: number,
		public startIndex: number,
		public endIndex: number
	) {}
}

async function p2023day3_part2(input: string, ...params: any[]) {
	let grid = input.split('\n');
	let sum = 0;
	let partsList = [];
	let rowParts: Part[] = [];
	let numStart: number | null = null;
	let numEnd: number | null = null;
	function reset() {
		numStart = null
		numEnd = null
	}

	for (let i = 0; i < grid.length; i++) {
		const row = grid[i];
		rowParts = []
		partsList.push(rowParts);
		for (let j = 0; j < row.length; j++) {
			const character = row[j];
			if(character.match(/(\d)/)) {
				if(isNull(numStart)) {
					numStart = j;
				}
			} else {
				numEnd = j;
				if(!isNull(numStart) && !isNull(numEnd)) {
					let num = +row.substring(numStart, numEnd);
					rowParts.push(new Part(num, numStart, numEnd))
				}	
				reset()
			}
		}
		numEnd = row.length;
		if(row[row.length - 1].match(/(\d)/) && !isNull(numStart) && !isNull(numEnd)) {
			let num = +row.substring(numStart, numEnd);
			rowParts.push(new Part(num, numStart, numEnd))
		}	
		reset()
	}

	for (let i = 0; i < grid.length; i++) {
		const row = grid[i];
		for (let j = 0; j < row.length; j++) {
			const character = row[j];
			if(character.match(/\*/)) {
				let nearParts = partsList.slice(safeSub(i),safeAdd(i, grid.length) + 1);
				let touchingParts: Part[] = [];
				nearParts.forEach(row => {
					row.forEach(part => {
						if((part.startIndex <= j + 1 && part.endIndex > j-1)) {
							touchingParts.push(part);
						}
					});
				});
				if(touchingParts.length == 2) {
					sum += touchingParts[0].val * touchingParts[1].val;
				}
			}
		}
	}

	return sum;
}

async function run() {
	const part1tests: TestCase[] = [{'input': `467..114..
...*......
..35..633.
......#...
617*592...
.....+.58.
..........
......755.
...$...*..
.664...598`, expected: '4361'}];
	const part2tests: TestCase[] = [{'input': `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`, expected: '467835'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2023, part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.formatTime(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.formatTime(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
