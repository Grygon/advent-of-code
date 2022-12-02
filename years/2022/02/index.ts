import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 2;

// solution path: Z:\advent-of-code\years\2022\02\index.ts
// data path    : Z:\advent-of-code\years\2022\02\data.txt
// problem url  : https://adventofcode.com/2022/day/2

let key = {
	"X":1,
	"Y":2,
	"Z":3,
	"A":1,
	"B":2,
	"C":3
};
type keys = keyof typeof key;

async function p2022day2_part1(input: string, ...params: any[]) {
	let total = 0;
	const lines = input.split("\n");

	for (const line of lines) {
		let round = line.split(" ") as keys[];
		total = total + scoreForRound(round[0], round[1])
	}
	return total;
}

function scoreForRound(a: keys, b: keys) {
	let choiceScore = key[b];
	if(key[b] == key[a]) return choiceScore + 3;
	if(doesAWin(key[b], key[a])) return choiceScore + 6;
	else return choiceScore + 0;		
}

function doesAWin(a: number, b: number) {
	switch (a) {
		case 1:
			return b==3;
		case 2:
			return b==1;
		case 3:
			return b==2;
	}

}

async function p2022day2_part2(input: string, ...params: any[]) {
	let total = 0;
	const lines = input.split("\n");

	for (const line of lines) {
		let round = line.split(" ") as keys[];
		let offset = key[round[1]] - 2;
		let choice = (((key[round[0]] - 1) + offset + 3) % 3) + 1;
		total = total + choice + (offset ? 3 + offset * 3 : 3);
	}
	return total;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2022, part1Solution, part2Solution);

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
