import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { round } from "lodash";

const YEAR = 2023;
const DAY = 6;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\06\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\06\data.txt
// problem url  : https://adventofcode.com/2023/day/6

async function p2023day6_part1(input: string, ...params: any[]) {
	let times = [...input.split("\n")[0].matchAll(/\d+/g)].map((i) => +i[0]);
	let distances = [...input.split("\n")[1].matchAll(/\d+/g)].map((i) => +i[0]);
	let allSolns: number[] = []

	times.forEach((time, i) => {
		let z = .5 * (time - Math.sqrt(time**2 - (4 * distances[i]))) + .001;
		let minTime = Math.floor(z);
		let maxTime = time - Math.ceil(z);
		let solns = maxTime - minTime;
		allSolns.push(solns);
	});

	return allSolns.reduce((prev, cur) => prev * cur);
}

async function p2023day6_part2(input: string, ...params: any[]) {
	let times = [...input.split("\n")[0].replace(/ /g,"").matchAll(/\d+/g)].map((i) => +i[0]);
	let distances = [...input.split("\n")[1].replace(/ /g,"").matchAll(/\d+/g)].map((i) => +i[0]);
	let allSolns: number[] = []

	times.forEach((time, i) => {
		let z = .5 * (time - Math.sqrt(time**2 - (4 * distances[i]))) + .001;
		let minTime = Math.floor(z);
		let maxTime = time - Math.ceil(z);
		let solns = maxTime - minTime;
		allSolns.push(solns);
	});

	return allSolns.reduce((prev, cur) => prev * cur);
}

async function run() {
	const part1tests: TestCase[] = [{input: `Time:      7  15   30
	Distance:  9  40  200`, expected: '288'}];
	const part2tests: TestCase[] = [{input: `Time:      7  15   30
	Distance:  9  40  200`, expected: '71503'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day6_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day6_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day6_part2(input));
	const part2After = performance.now();

	logSolution(6, 2023, part1Solution, part2Solution);

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
