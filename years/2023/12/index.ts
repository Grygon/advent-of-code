import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { sum } from 'lodash';

const YEAR = 2023;
const DAY = 12;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\12\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\12\data.txt
// problem url  : https://adventofcode.com/2023/day/12
let cache = new Map();

function possibleIterations(line: string, groups: number[]): number {
	let cachedLine: {groups: number[], val: number}[] = cache.get(line);
	if(cachedLine) {
		let cachedResult = cachedLine.find((l) => JSON.stringify(l.groups) === JSON.stringify(groups))
		if(cachedResult) return cachedResult.val;
	}
	let minSpace = groups.reduce((a, b) => a + b, 0) + groups.length - 1
	if(line.length < minSpace) return 0;
	let lineDup = [...line]
	let isPossible = 0;
	let target = groups[0];
	while(lineDup.length >= target) {
		if(lineDup[0] == "#" || lineDup[0] == "?") {
			if(lineDup.slice(0,target).every((c) => c == "?" || c == "#")) {
				if(groups.length == 1 && lineDup.slice(target).every((c) => c != "#")) isPossible++;
				else {
					if(lineDup[target] !== "#") {
						isPossible += possibleIterations(lineDup.slice(target + 1).join(""), groups.slice(1))
					}
				}
			} 
		}
		if(lineDup[0] == "#") break
		lineDup = lineDup.slice(1)
	}
	if(cachedLine) cachedLine.push({groups, val: isPossible})
	else cache.set(line,[{groups, val: isPossible}])
	return isPossible
}

async function p2023day12_part1(input: string, ...params: any[]) {
	let lines = input.split('\n');
	let springLines = lines.map((l) => l.split(' ')[0]);
	let springGroups = lines.map((l) => l.split(' ')[1].split(',').map((c) => +c));
	let sum = 0;

	springLines.forEach((sl, i) => {
		let ret = possibleIterations(sl, springGroups[i])
		sum += ret
	});

	return sum;
}

async function p2023day12_part2(input: string, ...params: any[]) {
	let lines = input.split('\n');
	let springLines = lines.map((l) => l.split(' ')[0]);
	let springGroups = lines.map((l) => l.split(' ')[1].split(',').map((c) => +c));

	springLines = springLines.map((line) => {
		return line+"?"+line+"?"+line+"?"+line+"?"+line
	})

	springGroups = springGroups.map((line) => {
		return [...line,...line,...line,...line,...line,]
	})

	let results = springLines.map((sl, i) => {
		let ret = possibleIterations(sl, springGroups[i])
		console.log("Processed line " + i)
		return ret
	});

	return results.reduce((a, b) => a + b)
}

async function run() {
	const part1tests: TestCase[] = [{input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`, expected: `21`}];
	const part2tests: TestCase[] = [{input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`, expected: `525152`}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day12_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day12_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day12_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day12_part2(input));
	const part2After = performance.now();

	logSolution(12, 2023, part1Solution, part2Solution);

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
