import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { forEach } from 'lodash';

const YEAR = 2023;
const DAY = 13;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\13\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\13\data.txt
// problem url  : https://adventofcode.com/2023/day/13

function findReflections(grid: string[]): number[] {
	let reflects = []
	for (let i = 0; i < grid.length - 1; i++) {
		let isReflect = true;
		for (let j = 0; j <= i; j++) {
			if(i + j + 1 >= grid.length) break
			if(JSON.stringify(grid[i - j]) !== JSON.stringify(grid[i + j + 1])) {
				isReflect = false;
				break
			}
		}
		if(isReflect) reflects.push(i);
	}

	return reflects;
}

async function p2023day13_part1(input: string, ...params: any[]) {
	let inputs = input.split("\n\n")
	let rowReflects: number[] = []
	let colReflects: number[] = []
	inputs.forEach((input) => {
		let rows: string[] = input.split('\n');
		let cols: string[] = Array(rows[0].length);
		rows.forEach(row => {
			[...row].forEach((c, i) => {
				if(cols[i]) cols[i] += c
				else cols[i] = c
			})
		})
		rowReflects = rowReflects.concat(findReflections(rows))
		colReflects = colReflects.concat(findReflections(cols))
	})

	let rowSum = rowReflects.reduce((a, b) => a + ((b + 1)* 100), 0)
	let colSum = colReflects.reduce((a, b) => a + (b + 1), 0)
	return colSum + rowSum
}

function findSmudgedReflection(grid: string[]): number {
	for (let i = 0; i < grid.length - 1; i++) {
		let isReflect = true;
		let smudgedSpot: number[] = []
		for (let j = 0; j <= i; j++) {
			if(i + j + 1 >= grid.length) break
			let arr1 = grid[i - j]
			let arr2 = grid[i + j + 1]
			for (let k = 0; k < arr1.length; k++) {
				if(arr1[k] === arr2[k]) continue;
				else if(!smudgedSpot.length) {
					smudgedSpot = [i - j, k]
				} else {
					isReflect = false;
					break
				}
			}
		}
		if(isReflect && smudgedSpot.length) {
			grid[smudgedSpot[0]] = grid[smudgedSpot[0]].slice(0,smudgedSpot[1]) + (grid[smudgedSpot[0]].charAt(smudgedSpot[1]) == "#" ? "." : "#") + grid[smudgedSpot[0]].slice(smudgedSpot[1] + 1)
			return i
		};
	}
	return -1
}

async function p2023day13_part2(input: string, ...params: any[]) {
	let inputs = input.split("\n\n")
	let rowReflects: number[] = []
	let colReflects: number[] = []
	inputs.forEach((input) => {
		let rows: string[] = input.split('\n');
		let cols: string[] = Array(rows[0].length);
		rows.forEach(row => {
			[...row].forEach((c, i) => {
				if(cols[i]) cols[i] += c
				else cols[i] = c
			})
		})
		rowReflects.push(findSmudgedReflection(rows))
		colReflects.push(findSmudgedReflection(cols))
	})

	let rowSum = rowReflects.reduce((a, b) => a + ((b + 1)* 100), 0)
	let colSum = colReflects.reduce((a, b) => a + (b + 1), 0)
	return colSum + rowSum
}

async function run() {
	const part1tests: TestCase[] = [{input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`, expected: '405'}];
	const part2tests: TestCase[] = [{input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`, expected: '400'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day13_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day13_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day13_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day13_part2(input));
	const part2After = performance.now();

	logSolution(13, 2023, part1Solution, part2Solution);

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
