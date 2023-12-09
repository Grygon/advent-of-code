import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { sum } from "lodash";

const YEAR = 2023;
const DAY = 8;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\08\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\08\data.txt
// problem url  : https://adventofcode.com/2023/day/8

async function p2023day8_part1(input: string, ...params: any[]) {
	let instruction = input.split("\n\n")[0];
	let rawNodes = input.split("\n\n")[1].split('\n');
	let nodes = new Map<string, string[]>();
	let counter = 0;
	let curNode = "AAA";

	rawNodes.forEach(node => {
		let match = node.match(/(\D+) \= \((\D+)\, (\D+)\)/);
		if(!match) throw Error("Error")
		nodes.set(match[1], [match[2], match[3]])
	});

	while(curNode !== "ZZZ") {
		if(instruction.slice(0,1) == "L") {
			let procNode = nodes.get(curNode);
			if(!procNode) throw Error("Error")
			curNode = procNode[0]
		} else {
			let procNode = nodes.get(curNode);
			if(!procNode) throw Error("Error")
			curNode = procNode[1]
		}
		counter++;
		instruction = instruction.slice(1) + instruction.slice(0,1);
	}

	return counter;
}

async function p2023day8_part2(input: string, ...params: any[]) {
	let instruction = input.split("\n\n")[0];
	let rawNodes = input.split("\n\n")[1].split('\n');
	let nodes = new Map<string, string[]>();
	let startingNodes: string[] = [];

	rawNodes.forEach(node => {
		let match = node.match(/(\w+) \= \((\w+)\, (\w+)\)/);
		if(!match) throw Error("Error")
		nodes.set(match[1], [match[2], match[3]])
		if(match[1][2] == "A") startingNodes.push(match[1])
	});

	let allRuns = startingNodes.map(startNode => {
		let counter = 0;
		let curNode = startNode;
		while(curNode[2] !== "Z") {
			if(instruction.slice(0,1) == "L") {
				let procNode = nodes.get(curNode);
				if(!procNode) throw Error("Error, no L node")
				curNode = procNode[0]
			} else {
				let procNode = nodes.get(curNode);
				if(!procNode) throw Error("Error, no R node")
				curNode = procNode[1]
			}
			counter++;
			instruction = instruction.slice(1) + instruction.slice(0,1);
		}
		return counter;
	});

	const gcd: (a: number, b: number) => number = (a: number, b: number) => {return b == 0 ? a : gcd (b, a % b)}
	const lcm = (a: number, b: number) =>  a / gcd (a, b) * b

	return allRuns.reduce(lcm);
}

async function run() {
	const part1tests: TestCase[] = [{input:`RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`, expected: '2'},{input:`LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`, expected: '6'}];
	const part2tests: TestCase[] = [{input:`LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`, expected: '6'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2023, part1Solution, part2Solution);

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
