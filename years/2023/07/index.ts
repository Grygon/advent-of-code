import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2023;
const DAY = 7;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\07\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\07\data.txt
// problem url  : https://adventofcode.com/2023/day/7

interface Hand {
	hand: string, 
	bid: number
}

let valMappings = {
	'2': 2,
	'3': 3,
	'4': 4,
	'5': 5,
	'6': 6,
	'7': 7,
	'8': 8,
	'9': 9,
	'T': 10,
	'J': 1,
	'Q': 12,
	'K': 13,
	'A': 14
}

async function p2023day7_part1(input: string, ...params: any[]) {
	let lines: string[] = input.split('\n');
	let hands: Hand[] = lines.map((i) => {return {hand: i.split(' ')[0], bid: +i.split(' ')[1]}})
	let rankedHands: Hand[][] = [[],[],[],[],[],[],[]]

	function returnType(hand: string): 0|1|2|3|4|5|6 {
		let valCounter: number[] = []
		Object.keys(valMappings).forEach((val) => {
			valCounter.push([...hand.matchAll(new RegExp(val,"g"))].length)
		})
		valCounter.sort((a, b) => b - a);
		if(valCounter[0] == 5) return 0;
		if(valCounter[0] == 4) return 1;
		if(valCounter[0] == 3 && valCounter[1] == 2) return 2;
		if(valCounter[0] == 3) return 3;
		if(valCounter[0] == 2 && valCounter[1] == 2) return 4;
		if(valCounter[0] == 2) return 5;
		return 6
	}

	hands.forEach((hand) => {
		rankedHands[returnType(hand.hand)].push(hand)
	})

	rankedHands.forEach((ranking) => {
		ranking.sort((hand1, hand2) => {
			for (let i = 0; i < hand1.hand.length; i++) {
				const char1 = hand1.hand[i];
				const char2 = hand2.hand[i];
				//@ts-ignore
				if(char1 !== char2) return valMappings[char2] - valMappings[char1]
			}
			return 0;
		})
	})
	
	let flatHands = rankedHands.flat().reverse();
	let sum = 0;

	flatHands.forEach((hand, i) => {
		sum += hand.bid * (i + 1);
	})
	
	return sum;
}

async function p2023day7_part2(input: string, ...params: any[]) {
	let lines: string[] = input.split('\n');
	let hands: Hand[] = lines.map((i) => {return {hand: i.split(' ')[0], bid: +i.split(' ')[1]}})
	let rankedHands: Hand[][] = [[],[],[],[],[],[],[]]

	function returnType(hand: string): 0|1|2|3|4|5|6 {
		let valCounter: number[] = []
		let jokerCounter = 0;
		Object.keys(valMappings).forEach((val) => {
			if(val=='J') {
				jokerCounter = [...hand.matchAll(new RegExp(val,"g"))].length;
			} else {
				valCounter.push([...hand.matchAll(new RegExp(val,"g"))].length)
			}
		})
		valCounter.sort((a, b) => b - a);
		if(valCounter[0] + jokerCounter == 5) return 0;
		if(valCounter[0] + jokerCounter == 4) return 1;
		if(valCounter[0] + jokerCounter == 3 && valCounter[1] == 2) return 2;
		if(valCounter[0] + jokerCounter == 3) return 3;
		if(valCounter[0] + jokerCounter == 2 && valCounter[1] == 2) return 4;
		if(valCounter[0] + jokerCounter == 2) return 5;
		return 6
	}

	hands.forEach((hand) => {
		rankedHands[returnType(hand.hand)].push(hand)
	})

	rankedHands.forEach((ranking) => {
		ranking.sort((hand1, hand2) => {
			for (let i = 0; i < hand1.hand.length; i++) {
				const char1 = hand1.hand[i];
				const char2 = hand2.hand[i];
				//@ts-ignore
				if(char1 !== char2) return valMappings[char2] - valMappings[char1]
			}
			return 0;
		})
	})
	
	let flatHands = rankedHands.flat().reverse();
	let sum = 0;

	flatHands.forEach((hand, i) => {
		sum += hand.bid * (i + 1);
	})
	
	return sum;
}

async function run() {
	const part1tests: TestCase[] = [{input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`, expected: '6440'},
{input: `AAAAA 2
22222 3
AAAAK 5
22223 7
AAAKK 11
22233 13
AAAKQ 17
22234 19
AAKKQ 23
22334 29
AAKQJ 31
22345 37
AKQJT 41
23456 43`, expected: "1343"}];
	const part2tests: TestCase[] = [{input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`, expected: '5905'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2023, part1Solution, part2Solution);

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
