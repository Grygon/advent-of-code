import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2023;
const DAY = 4;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\04\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\04\data.txt
// problem url  : https://adventofcode.com/2023/day/4

async function p2023day4_part1(input: string, ...params: any[]) {
	let cards = input.split("\n");
	let sum = 0;


	cards.forEach((card, i) => {
		let winningNums = (card.match(/Card\s+\d+: ((\d+| )+)\|/) as string[])[1].split(" ").map((i) => {if(i) return +i}).filter((i) => i);
		let obtainedNums = (card.match(/\|((\d+| )+)$/) as string[])[1].split(" ").map((i) => {if(i) return +i}).filter((i) => i);
		let matches = 0;
		obtainedNums.forEach(obt => {
			winningNums.forEach(win => {
				if(obt == win) {
					matches++;
				}
			});
		});
		if(matches) sum += 2**(matches-1);
	});

	return sum;

}

async function p2023day4_part2(input: string, ...params: any[]) {
	let cards = input.split("\n");
	let origCards = [...cards];
	let cardMatches: number[] = [];
	let computedMatches: number[] = [];
	let sum = 0;

	for (let i = 0; i < cards.length; i++) {
		const card = cards[i];
		let winMatch = card.match(/Card\s+(\d)+: ((\d+| )+)\|/) as string[];
		let winningNums = (winMatch)[2].split(" ").map((i) => {if(i) return +i}).filter((i) => i);
		let cardId = +winMatch[1];
		let obtainedNums = (card.match(/\|((\d+| )+)$/) as string[])[1].split(" ").map((i) => {if(i) return +i}).filter((i) => i);
		let matches = 0;
		obtainedNums.forEach(obt => {
			winningNums.forEach(win => {
				if(obt == win) {
					matches++;
				}
			});
		});
		cardMatches.push(matches)
		computedMatches.push(1)
	}

	cardMatches.forEach((cardMatch, i) => {
		for (let k = 1; k <= computedMatches[i]; k++) {
			sum++;
			for (let j = 1; j <= cardMatch; j++) {
				computedMatches[i + j]++;
			}			
		}
	});

	return sum;
}

async function run() {
	const part1tests: TestCase[] = [{input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`, expected: '13'}];
	const part2tests: TestCase[] = [{input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
	Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
	Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
	Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
	Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
	Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`, expected: '30'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day4_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day4_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day4_part2(input));
	const part2After = performance.now();

	logSolution(4, 2023, part1Solution, part2Solution);

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
