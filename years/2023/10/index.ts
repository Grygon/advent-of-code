import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { forEach, max, min } from "lodash";

const YEAR = 2023;
const DAY = 10;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\10\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\10\data.txt
// problem url  : https://adventofcode.com/2023/day/10

interface Coords {
	x: number;
	y: number;
}

function convertChars(s: string) {
	switch (s) {
		case "|":
			return "UD"
		case "-":
			return "LR"
		case "L":
			return "UR"
		case "J":
			return "UL"
		case "7":
			return "LD"
		case "F":
			return "DR"
	}
	return s;
}

function inferShape(coords: Coords, grid: string[][]) {
	let inferredVals = "";
	if(grid[coords.y][safeAdd(coords.x, grid[coords.y].length)].includes("L")) inferredVals += "R"
	if(grid[coords.y][safeSub(coords.x)].includes("R")) inferredVals += "L"
	if(grid[safeAdd(coords.y, grid.length)][coords.x].includes("U")) inferredVals += "D"
	if(grid[safeSub(coords.y)][coords.x].includes("D")) inferredVals += "U"
	if(inferredVals.length !== 2) throw Error("Your inferred shape is wrong!")
	return inferredVals;
}


function safeSub(i: number) {
	return max([i - 1, 0]) || 0;
}
function safeAdd(i: number, m: number) {
	return min([i + 1, m]) || 0;
}

function stepGrid(coords: Coords, grid: string[][], prevStep: string) {
	let cur = grid[coords.y][coords.x];
	let n: Coords = {...coords};
	let step = "";
	if(cur.includes("L") && prevStep !== "R") {
		n.x = coords.x - 1;
		step = "L"
		return {newCoords: n, stepTaken: step}
	}
	else if(cur.includes("R")&& prevStep !== "L") {
		n.x = coords.x + 1;
		step = "R"
		return {newCoords: n, stepTaken: step}
	}
	if(cur.includes("U")&& prevStep !== "D") {
		n.y = coords.y - 1;
		step = "U"
		return {newCoords: n, stepTaken: step}
	}
	else if(cur.includes("D")&& prevStep !== "U") {
		n.y = coords.y + 1;
		step = "D"
		return {newCoords: n, stepTaken: step}
	}
	throw Error("Didn't take a step!")
	return {newCoords: n, stepTaken: step}
}

async function p2023day10_part1(input: string, ...params: any[]) {
	let coords!: Coords;
	let grid = input.split('\n').map((line, i) => [...line].map((c, j) => {
		if(c=="S") coords = {x: j, y: i};
		return convertChars(c);
	}));
	let startingCoords = coords;
	
	if(coords == undefined) throw Error("No coords")

	grid[coords.y][coords.x] = inferShape(coords, grid);
	let count = 1;
	let prevStep = "";

	({newCoords: coords, stepTaken: prevStep} = stepGrid(coords, grid, prevStep));
	while(!(coords.x == startingCoords.x && coords.y == startingCoords.y)) {
		count++
		({newCoords: coords, stepTaken: prevStep} = stepGrid(coords, grid, prevStep));
	}

	return count / 2
}

function checkInside(point: number[], vertices: number[][]) {
	const x = point[0]
	const y = point[1]
	
	let inside = false
	for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
		const xi = vertices[i][0],
		yi = vertices[i][1]
		const xj = vertices[j][0],
		yj = vertices[j][1]
	
		const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
		if (intersect) inside = !inside
	}
	
	return inside
}

async function p2023day10_part2(input: string, ...params: any[]) {
	let coords!: Coords;
	let grid = input.split('\n').map((line, i) => [...line].map((c, j) => {
		if(c=="S") coords = {x: j, y: i};
		return convertChars(c);
	}));
	let startingCoords = coords;
	let visitedCoords: number[][] = [[startingCoords.x, startingCoords.y]];
	
	if(coords == undefined) throw Error("No coords")

	grid[coords.y][coords.x] = inferShape(coords, grid);
	let prevStep = "";
	let inside = 0;

	({newCoords: coords, stepTaken: prevStep} = stepGrid(coords, grid, prevStep));
	while(!(coords.x == startingCoords.x && coords.y == startingCoords.y)) {
		({newCoords: coords, stepTaken: prevStep} = stepGrid(coords, grid, prevStep));
		visitedCoords.push([coords.x, coords.y]);
	}

	grid.forEach((line, y) => {
		line.forEach((point, x) => {
			if(checkInside([x, y], visitedCoords)) inside++;
		})
	})
	

	return inside - (visitedCoords.length / 2) ;
}

async function run() {
	const part1tests: TestCase[] = [{input:`..F7.
.FJ|.
SJ.L7
|F--J
LJ...`, expected: '8'}, {input: `.....
.S-7.
.|.|.
.L-J.
.....`, expected: '4'}];
	const part2tests: TestCase[] = [{input:`...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`, expected: '4'}, {input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`, expected: '8'}, {input: `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`, expected: '10'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day10_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day10_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day10_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day10_part2(input));
	const part2After = performance.now();

	logSolution(10, 2023, part1Solution, part2Solution);

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
