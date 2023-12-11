import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2023;
const DAY = 11;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\11\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\11\data.txt
// problem url  : https://adventofcode.com/2023/day/11

function expandImage(image: string[]) {
	let newImage = [...image];
	let inserted = 0;
	image.forEach((line, i) => {
		if([...line].every((c) => c==".")) {
			newImage = [
				...newImage.slice(0, i + inserted),
				line,
				...newImage.slice(i+inserted++)
			]
		}
	})

	inserted = 0;

	for (let i = 0; i < image[0].length; i++) {
		let insert = true;
		image.forEach((line) => {
			if(line[i] != ".") insert = false;
		})
		if(insert) {
			newImage.forEach((line, j) => {
				newImage[j] = line.slice(0, i + inserted) + 
					"." + 
					line.slice(i+inserted)
			})
			inserted++
		}		
	}

	return newImage
}

async function p2023day11_part1(input: string, ...params: any[]) {
	let image = input.split('\n');
	image = expandImage(image);
	let galaxies: number[][] = []

	image.forEach((line, y) => {
		[...line].forEach((char, x) => {
			if(char=="#") galaxies.push([x, y])
		})
	})

	let sum = 0;

	galaxies.forEach((gal1, i) => {
		galaxies.slice(i).forEach((gal2, j) => {
			sum += Math.abs(gal1[0] - gal2[0])
			sum += Math.abs(gal1[1] - gal2[1])
		})
	})

	return sum;
}

function superExpandImage(image: string[]) {
	let expandedVals: {cols: number[], rows: number[]} = {
		cols: [],
		rows: []
	}
	image.forEach((line, i) => {
		if([...line].every((c) => c==".")) {
			expandedVals.rows.push(i)
		}
	})

	for (let i = 0; i < image[0].length; i++) {
		let insert = true;
		image.forEach((line) => {
			if(line[i] != ".") insert = false;
		})
		if(insert) {
			expandedVals.cols.push(i)
		}		
	}

	return expandedVals
}

async function p2023day11_part2(input: string, ...params: any[]) {
	let image = input.split('\n');
	let galaxies: number[][] = []
	let expandedVals = superExpandImage(image);
	let expandVal = 1000000;

	image.forEach((line, y) => {
		[...line].forEach((char, x) => {
			if(char=="#") galaxies.push([x, y])
		})
	})

	let sum = 0;

	galaxies.forEach((gal1, i) => {
		galaxies.slice(i).forEach((gal2, j) => {
			sum += Math.abs(gal1[0] - gal2[0])
			sum += Math.abs(gal1[1] - gal2[1])
			expandedVals.rows.forEach((row) => {
				if((gal1[1] < row && gal2[1] > row) || (gal1[1] > row && gal2[1] < row)) sum += expandVal - 1;
			})
			expandedVals.cols.forEach((col) => {
				if((gal1[0] < col && gal2[0] > col) || (gal1[0] > col && gal2[0] < col)) sum += expandVal - 1;
			})
		})
	})

	return sum;
}

async function run() {
	const part1tests: TestCase[] = [{input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`, expected: '374'}];
	const part2tests: TestCase[] = [{input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`, expected: '8410'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day11_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day11_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day11_part2(input));
	const part2After = performance.now();

	logSolution(11, 2023, part1Solution, part2Solution);

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
