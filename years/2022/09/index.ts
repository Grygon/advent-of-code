import _, { tail } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 9;

// solution path: Z:\advent-of-code\years\2022\09\index.ts
// data path    : Z:\advent-of-code\years\2022\09\data.txt
// problem url  : https://adventofcode.com/2022/day/9

async function p2022day9_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let instructions: {
		dir: string,
		count: number
	}[] = [];
	let headPos = {
		"x": 0,
		"y": 0
	};
	let tailPos = {...headPos};
	let tailRecord = new Set();
	tailRecord.add(tailPos.x.toString() + "," + tailPos.y.toString());
	for (const line of lines) {
		let split = line.split(" ");
		instructions.push({
			dir: split[0],
			count: parseInt(split[1])
		});
	}

	instructions.forEach((ins) => {
		for (let i = 0; i < ins.count; i++) {
			let lastPos = {...headPos};
			switch(ins.dir) {
				case "R":
					headPos.x += 1;
					break;
				case "L":
					headPos.x -= 1;
					break;
				case "U":
					headPos.y += 1;
					break;
				case "D":
					headPos.y -= 1;
					break;
			}

			if(Math.abs(headPos.x - tailPos.x) > 1 || Math.abs(headPos.y - tailPos.y) > 1) {
				tailPos = lastPos;
				tailRecord.add(tailPos.x.toString() + "," + tailPos.y.toString());
			}
		}
	});

	return tailRecord.size;
}

async function p2022day9_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let instructions: {
		dir: string,
		count: number
	}[] = [];
	let knotPos: {x: number, y: number}[] = Array.from({length:10},i => {return {x:0,y:0}});
	let tailRecord = new Set();
	tailRecord.add('0,0');
	for (const line of lines) {
		let split = line.split(" ");
		instructions.push({
			dir: split[0],
			count: parseInt(split[1])
		});
	}

	instructions.forEach((ins) => {
		for (let i = 0; i < ins.count; i++) {
			switch(ins.dir) {
				case "R":
					knotPos[0].x += 1;
					break;
				case "L":
					knotPos[0].x -= 1;
					break;
				case "U":
					knotPos[0].y += 1;
					break;
				case "D":
					knotPos[0].y -= 1;
					break;
			}

			for (let i = 0; i < knotPos.length - 1; i++) {
				let xDif = knotPos[i].x - knotPos[i + 1].x;
				let yDif = knotPos[i].y - knotPos[i + 1].y;
				if((Math.abs(xDif) + Math.abs(yDif)) > 2) {
					// Diagonal
					if(xDif > 0) {
						knotPos[i+1].x += 1;
					} else if(xDif < 0) {
						knotPos[i+1].x -= 1;
					}
					if(yDif > 0) {
						knotPos[i+1].y += 1;
					} else if(yDif < 0) {
						knotPos[i+1].y -= 1;
					}
				} else {
					if(xDif > 1) {
						knotPos[i+1].x += 1;
					} else if(xDif < -1) {
						knotPos[i+1].x -= 1;
					}
					if(yDif > 1) {
						knotPos[i+1].y += 1;
					} else if(yDif < -1) {
						knotPos[i+1].y -= 1;
					}
				}

				if(i == knotPos.length - 2) 
					tailRecord.add(knotPos[i+1].x.toString() + "," + knotPos[i+1].y.toString());
			}
		}
	});

	return tailRecord.size;
}

async function run() {
	const part1tests: TestCase[] = [{
		input:`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
		expected:"13"
	}];
	const part2tests: TestCase[] = [{
		input: `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`,
		expected: "36"
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day9_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day9_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day9_part2(input));
	const part2After = performance.now();

	logSolution(9, 2022, part1Solution, part2Solution);

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
