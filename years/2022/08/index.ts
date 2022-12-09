import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 8;

// solution path: Z:\advent-of-code\years\2022\08\index.ts
// data path    : Z:\advent-of-code\years\2022\08\data.txt
// problem url  : https://adventofcode.com/2022/day/8

async function p2022day8_part1(input: string, ...params: any[]) {
	let trees: number[][] = [];

	const lines = input.split("\n");
	for (const line of lines) {
		let arr = [];
		for (const tree of line.split("")) {
			arr.push(parseInt(tree));
		}
		trees.push(arr);
	}

	return 2*trees.length + (2*(trees.length - 2)) + getScore(trees, 1);
}

function getScore(trees: number[][], inset: number): number {
	let x = inset;
	let y = inset;
	let score = 0;
	let state = 0;
	
	while(state < 4) {
		let slices: number[][] = [[],[]];
		for (let i = 0; i < trees.length; i++) {
			if(i==y) continue;
			slices[Number(i < y)].push(trees[i][x]);
		}

		slices.push(trees[y].slice(0,x));
		slices.push(trees[y].slice(x+1,trees[y].length));
		
		for (let i = 0; i < slices.length; i++) {
			const slice = slices[i];
			if(Math.max(...slice) < trees[y][x]) {
				score++;
				break;
			}
		}

		if(inset == Math.trunc(trees.length/2)) return score;

		switch(state) {
			case 0:
				if(++x >= trees[y].length - inset - 1)
					state++;
				break;
			case 1:
				if(++y >= trees.length - inset - 1)
					state++;
				break;
			case 2:
				if(--x <= inset)
					state++;
				break;
			case 3:
				if(--y <= inset)
					state++;
				break;
		}
	}


	return score + getScore(trees, ++inset)
}

async function p2022day8_part2(input: string, ...params: any[]) {
	let trees: number[][] = [];

	const lines = input.split("\n");
	for (const line of lines) {
		let arr = [];
		for (const tree of line.split("")) {
			arr.push(parseInt(tree));
		}
		trees.push(arr);
	}
	
	let max = 0;
	
	for (let i = 0; i < trees.length; i++) {
		const row = trees[i];
		for (let j = 0; j < row.length; j++) {
			const tree = row[j];
			let score = 1;
			
			let slices: number[][] = [[],[]];
			for (let k = 0; k < trees.length; k++) {
				if(k==i) continue;
				slices[Number(k < i)].push(trees[k][j]);
			}
			slices[1].reverse();

			slices.push(trees[i].slice(0,j).reverse());
			slices.push(trees[i].slice(j+1,trees[i].length));
			

			for (let i = 0; i < slices.length; i++) {
				const slice = slices[i];
				for (let k = 0; k < slice.length; k++) {
					if(slice[k] >= tree) {
						slices[i] = slice.slice(0,k + 1);
						break;
					}
				}
			}

			slices.forEach(s => {
				score *= s.length;
			});

			if(score > max) max = score;
		}
		
	}

	return max;
}

async function run() {
	const part1tests: TestCase[] = [{
		input:`30373
25512
65332
33549
35390`, expected: '21'
	}];
	const part2tests: TestCase[] = [{
		input:`30373
25512
65332
33549
35390`, expected: '8'
	}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day8_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day8_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day8_part2(input));
	const part2After = performance.now();

	logSolution(8, 2022, part1Solution, part2Solution);

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
