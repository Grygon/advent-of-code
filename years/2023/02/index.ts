import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2023;
const DAY = 2;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\02\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\02\data.txt
// problem url  : https://adventofcode.com/2023/day/2



async function p2023day2_part1(input: string, ...params: any[]) {
	class Game {
		id: number;
		valid: boolean;
	
		constructor(id: number) {
			this.id = id;
			this.valid = false;
		}
	}

	const maxRed = 12;
	const maxGreen = 13;
	const maxBlue = 14;

	let allGames: Game[] = [];

	const games = input.split("\n")

	games.forEach((line) => {
		let id = +((line.match(/.*?(\d+).*$/) as string[])[1]);
		let game = new Game(id);
		allGames.push(game);
		const rounds = line.split(":")[1].split(";");
		let roundsPass = true;
		rounds.forEach((round) => {
			let redMatch = (round.match(/.*?(\d+) red.*/) as string[])
			let numRed = 0
			if (redMatch) numRed = +(redMatch[1]);
			let greenMatch = (round.match(/.*?(\d+) green.*/) as string[])
			let numGreen = 0
			if (greenMatch) numGreen = +(greenMatch[1]);
			let blueMatch = (round.match(/.*?(\d+) blue.*/) as string[])
			let numBlue = 0
			if (blueMatch) numBlue = +(blueMatch[1]);

			if (numRed > maxRed || numGreen > maxGreen || numBlue > maxBlue) roundsPass = false;
		})
		
		game.valid = roundsPass;
	})

	let passingGames = allGames.filter((g) => g.valid).map((g) => g.id);

	return passingGames.reduce((prev, cur) => prev + cur, 0)
}

async function p2023day2_part2(input: string, ...params: any[]) {
	class Game {
		id: number;
		valid: boolean;
		maxRed = 0;
		maxGreen = 0;
		maxBlue = 0;
	
		constructor(id: number) {
			this.id = id;
			this.valid = false;
		}
	}
	let allGames: Game[] = [];

	const games = input.split("\n")

	games.forEach((line) => {
		let id = +((line.match(/.*?(\d+).*$/) as string[])[1]);
		let game = new Game(id);
		allGames.push(game);
		const rounds = line.split(":")[1].split(";");
		let roundsPass = true;
		rounds.forEach((round) => {
			let redMatch = (round.match(/.*?(\d+) red.*/) as string[])
			if (redMatch && game.maxRed < +redMatch[1]) game.maxRed = +redMatch[1]
			let greenMatch = (round.match(/.*?(\d+) green.*/) as string[])
			if (greenMatch && game.maxGreen < +greenMatch[1]) game.maxGreen = +greenMatch[1]
			let blueMatch = (round.match(/.*?(\d+) blue.*/) as string[])
			if (blueMatch && game.maxBlue < +blueMatch[1]) game.maxBlue = +blueMatch[1]
		})
	})

	let poweredGames = allGames.map((g) => g.maxRed * g.maxGreen * g.maxBlue);

	return poweredGames.reduce((prev, cur) => prev + cur, 0)
}

async function run() {
	const part1tests: TestCase[] = [{input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
	Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
	Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
	Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
	Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`, expected: '8'}];
	const part2tests: TestCase[] = [{input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
	Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
	Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
	Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
	Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`, expected: '2286'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day2_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day2_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day2_part2(input));
	const part2After = performance.now();

	logSolution(2, 2023, part1Solution, part2Solution);

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
