import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 3;

// solution path: Z:\advent-of-code\years\2022\03\index.ts
// data path    : Z:\advent-of-code\years\2022\03\data.txt
// problem url  : https://adventofcode.com/2022/day/3

function getPriority(s: string){
	let pri = s.charCodeAt(0)-96;
	if(pri <= 0) pri = pri + 58;
	return pri
}

async function p2022day3_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let sum = 0;
	for (const line of lines) {
		let done = false;
		let first = line.substring(0, line.length/2).split("");
		let second = line.substring(line.length / 2, line.length).split("");
		for(const char1 of first) {
			if(done) break;
			for(const char2 of second) {
				if(done) break;
				if(char1.charCodeAt(0) == char2.charCodeAt(0)) {
					sum += getPriority(char1);
					done = true;
				}
			}
		}
	}
	return sum;
}

async function p2022day3_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let sum = 0;
	let groupArr = [];
	for (const line of lines) {
		if (groupArr.push(line)<3) continue;
		let done = false;
		for(const char1 of groupArr[0]) {
			if(done) break;
			for(const char2 of groupArr[1]) {
				if(done) break;
				for(const char3 of groupArr[2]) {
					if(done) break;
					if(char1.charCodeAt(0) == char2.charCodeAt(0) && char1.charCodeAt(0) == char3.charCodeAt(0)) {
						sum += getPriority(char1);
						done = true;
					}
				}
			}
		}
		groupArr = [];
	}
	return sum;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day3_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day3_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day3_part2(input));
	const part2After = performance.now();

	logSolution(3, 2022, part1Solution, part2Solution);

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
