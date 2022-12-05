import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { buffer } from "stream/consumers";

const YEAR = 2022;
const DAY = 5;

// solution path: Z:\advent-of-code\years\2022\05\index.ts
// data path    : Z:\advent-of-code\years\2022\05\data.txt
// problem url  : https://adventofcode.com/2022/day/5

async function p2022day5_part1(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let state: string[][] = [[],[],[],[],[],[],[],[],[]];
	let instructions: {count:number,from:number,to:number}[] = [];
	for (const line of lines) {
		if(line.substring(0,1) == "m") {
			let extract = line.match(/\d+/g);
			if(!extract || extract.length < 3) throw Error("Bad extract");
			instructions.push({
				count: parseInt(extract[0]),
				from: parseInt(extract[1]),
				to: parseInt(extract[2])
			});
		} else {
			for (let i = 0; i < 9; i++) {
				let crate = line.substring(i*4+1,i*4+2);
				if(parseInt(crate)) continue;
				if(crate.length > 0 && crate!==" ") state[i].push(crate);				
			}
		}
	}

	state = state.map((s) => s.reverse());

	instructions.forEach(command => {
		for (let i = 0; i < command.count; i++) {
			let from = state[command.from - 1].pop();
			if(!from) throw Error("Empty pile");
			state[command.to - 1].push(from);
		}
	});

	let final = "";

	state.forEach(s => {
		final = final.concat(s[s.length - 1] ? s[s.length - 1] : "");
	});

	return final;
}

async function p2022day5_part2(input: string, ...params: any[]) {
	const lines = input.split("\n");
	let state: string[][] = [[],[],[],[],[],[],[],[],[]];
	let instructions: {count:number,from:number,to:number}[] = [];
	for (const line of lines) {
		if(line.substring(0,1) == "m") {
			let extract = line.match(/\d+/g);
			if(!extract || extract.length < 3) throw Error("Bad extract");
			instructions.push({
				count: parseInt(extract[0]),
				from: parseInt(extract[1]),
				to: parseInt(extract[2])
			});
		} else {
			for (let i = 0; i < 9; i++) {
				let crate = line.substring(i*4+1,i*4+2);
				if(parseInt(crate)) continue;
				if(crate.length > 0 && crate!==" ") state[i].push(crate);				
			}
		}
	}

	state = state.map((s) => s.reverse());

	instructions.forEach(command => {
		let from = state[command.from - 1].splice(
			state[command.from - 1].length - command.count,
			command.count);
		if(!from) throw Error("Empty pile");
		state[command.to - 1] = state[command.to - 1].concat(from);
	});

	let final = "";

	state.forEach(s => {
		final = final.concat(s[s.length - 1] ? s[s.length - 1] : "");
	});

	return final;
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`, expected: "CMZ"
	}];
	const part2tests: TestCase[] = [{
		input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`, expected: "MCD"
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2022, part1Solution, part2Solution);

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
