import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2023;
const DAY = 9;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\09\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\09\data.txt
// problem url  : https://adventofcode.com/2023/day/9

async function p2023day9_part1(input: string, ...params: any[]) {
	let lines = input.split("\n");
	let histories = lines.map((l) => [...l.matchAll(/-*\d+/g)].map((n) => +n));
	let sum = 0;

	function getDifferences(nums: number[]) {
		let result = [];
		for (let i = 0; i < nums.length - 1; i++) {
			result.push(nums[i + 1] - nums[i])
		}
		return result;
	}
	
	histories.forEach(history => {
		let diffs = [];
		let cur = history;
		while(!cur.every((n) => n == 0)) {
			diffs.push(cur);
			cur = getDifferences(cur);
		}
		diffs.reverse();
		let addVal = 0;
		diffs.forEach((dif, i) => {
			addVal = dif[dif.length - 1] + addVal;
		});
		sum += addVal;
	});

	return sum;
}

async function p2023day9_part2(input: string, ...params: any[]) {
	let lines = input.split("\n");
	let histories = lines.map((l) => [...l.matchAll(/-*\d+/g)].map((n) => +n));
	let sum = 0;

	function getDifferences(nums: number[]) {
		let result = [];
		for (let i = 0; i < nums.length - 1; i++) {
			result.push(nums[i + 1] - nums[i])
		}
		return result;
	}
	
	histories.forEach(history => {
		let diffs = [];
		let cur = history;
		while(!cur.every((n) => n == 0)) {
			diffs.push(cur);
			cur = getDifferences(cur);
		}
		diffs.reverse();
		let addVal = 0;
		diffs.forEach((dif, i) => {
			addVal = dif[0] - addVal;
		});
		sum += addVal;
	});

	return sum;
}

async function run() {
	const part1tests: TestCase[] = [{input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`, expected: '114'}];
	const part2tests: TestCase[] = [{input: `0 3 6 9 12 15
	1 3 6 10 15 21
	10 13 16 21 30 45`, expected: '2'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day9_part2(input));
	const part2After = performance.now();

	logSolution(9, 2023, part1Solution, part2Solution);

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
