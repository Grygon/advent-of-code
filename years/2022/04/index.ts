import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { min } from '../../../util/util';

const YEAR = 2022;
const DAY = 4;

// solution path: Z:\advent-of-code\years\2022\04\index.ts
// data path    : Z:\advent-of-code\years\2022\04\data.txt
// problem url  : https://adventofcode.com/2022/day/4

async function p2022day4_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let count = 0;
	for (const line of lines) {
		let pairs = line.split(",").map((i) => {return i.split("-").map((c) => parseInt(c))}) as number[][];
		
		for (let i = 0; i < 2; i++) {
			let j = Number(!i);
			if(pairs[i][0] >= pairs[j][0] && pairs[i][1] <= pairs[j][1]) {
				count++;
				break;
			}
		}
	}
	return count;
}

async function p2022day4_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let count = 0;
	for (const line of lines) {
		let pairs = line.split(",").map((i) => {return i.split("-").map((c) => parseInt(c))}) as number[][];
		
		for (let i = 0; i < 2; i++) {
			let j = Number(!i);
			if((pairs[i][0] >= pairs[j][0] && pairs[i][0] <= pairs[j][1]) || (pairs[i][1] <= pairs[j][1] && pairs[i][1] >= pairs[j][0])) {
				count++;
				break;
			}
		}
	}
	return count;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2022, part1Solution, part2Solution);

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
