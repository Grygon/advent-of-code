import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";
import { chunk, round } from "lodash";

const YEAR = 2023;
const DAY = 5;

// solution path: C:\Users\Grygon\Documents\advent-of-code\years\2023\05\index.ts
// data path    : C:\Users\Grygon\Documents\advent-of-code\years\2023\05\data.txt
// problem url  : https://adventofcode.com/2023/day/5

async function p2023day5_part1(input: string, ...params: any[]) {
	let chunks = input.split("\n\n");
	let seedMap = [...(chunks[0] as string).matchAll(/\d+/g)].map((i) => +i)
	let seedSoilMap = (chunks[1] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let soilFertMap = (chunks[2] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let fertWaterMap = (chunks[3] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let waterLightMap = (chunks[4] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let lightTempMap = (chunks[5] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let tempHumidMap = (chunks[6] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let humLocMap = (chunks[7] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));

	let allMaps = [seedSoilMap, soilFertMap, fertWaterMap, waterLightMap, lightTempMap, tempHumidMap, humLocMap]

	function performMap(input: number, destRangeS: number, sourceRangeS: number, len: number) {
		if(input > sourceRangeS && input <= sourceRangeS + len) {
			return input - sourceRangeS + destRangeS;
		}
		//for (let i = 0; i < len; i++) {
		//	if(input == sourceRangeS + i) return destRangeS + i;			
		//}
		return input;
	}

	allMaps.forEach((mapList) => {
		let tmpMap: number[] = [];
		mapList.forEach((map) => {
			for (let i = 0; i < seedMap.length; i++) {
				if(!seedMap[i]) continue;
				let tmp = performMap(seedMap[i], map[0], map[1], map[2])			
				if(tmp != seedMap[i]) {
					delete seedMap[i];
					tmpMap.push(tmp)
				}
			}
		})
		seedMap = [...tmpMap].concat([...seedMap].filter((i) => i));
	})

	return(util.min(seedMap).value)
}

async function p2023day5_part2(input: string, ...params: any[]) {
	let chunks = input.split("\n\n");
	let rawSeedMap = [...(chunks[0] as string).matchAll(/\d+/g)].map((i) => +i)
	let seedMap: number[] = [];
	let seedSoilMap = (chunks[1] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let soilFertMap = (chunks[2] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let fertWaterMap = (chunks[3] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let waterLightMap = (chunks[4] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let lightTempMap = (chunks[5] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let tempHumidMap = (chunks[6] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));
	let humLocMap = (chunks[7] as string).split("\n").slice(1).map((line) => [...line.matchAll(/\d+/g)].map((i) => +i));

	let allMaps = [seedSoilMap, soilFertMap, fertWaterMap, waterLightMap, lightTempMap, tempHumidMap, humLocMap]


	let chunkSize = 2
	for (let i = 16; i < rawSeedMap.length; i += 2) {
		const first = rawSeedMap[i];
		const second = rawSeedMap[i + 1];
		
		if(second > 10000) {
			seedMap = seedMap.concat([...Array(round(second / chunkSize)).keys()].map((i) => round(i + first / chunkSize) * chunkSize))
		} else {
			seedMap = seedMap.concat([...Array(second).keys()].map((i) => i + first))
		}
		break
	}

	console.log("Seeds processed, number: " + seedMap.length)
	//console.log("Chunk size: " + chunkSize)

	function performMap(input: number, destRangeS: number, sourceRangeS: number, len: number) {
		if(input >= sourceRangeS && input < sourceRangeS + len) {
			return input + destRangeS - sourceRangeS;
		}
		//for (let i = 0; i < len; i++) {
		//	if(input == sourceRangeS + i) return destRangeS + i;			
		//}
		return input;
	}

	allMaps.forEach((mapList) => {
		let tmpMap: number[] = [];
		mapList.forEach((map) => {
			for (let i = 0; i < seedMap.length; i++) {
				if(!seedMap[i]) continue;
				let tmp = performMap(seedMap[i], map[0], map[1], map[2])			
				if(tmp != seedMap[i]) {
					delete seedMap[i];
					tmpMap.push(tmp)
				}
			}
		})
		seedMap = [...tmpMap].concat([...seedMap].filter((i) => i));
	})
	function revMap(input: number, destRangeS: number, sourceRangeS: number, len: number) {
		if(input >= destRangeS && input < destRangeS + len) {
			return input + sourceRangeS - destRangeS;
		}
		return input;
	}

	function workBackwards(input: number) {
		allMaps.forEach((mapList) => {
			let tmpMap: number[] = [];
			mapList.forEach((map) => {
				for (let i = 0; i < seedMap.length; i++) {
					if(!seedMap[i]) continue;
					let tmp = performMap(seedMap[i], map[0], map[1], map[2])			
					if(tmp != seedMap[i]) {
						delete seedMap[i];
						tmpMap.push(tmp)
					}
				}
			})
			seedMap = [...tmpMap].concat([...seedMap].filter((i) => i));
		})		
	}

	return(util.min(seedMap).value)
}

async function run() {
	const part1tests: TestCase[] = [{input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`, expected: '35'}];
	const part2tests: TestCase[] = [{input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`, expected: '46'}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2023day5_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2023day5_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2023day5_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2023day5_part2(input));
	const part2After = performance.now();

	logSolution(5, 2023, part1Solution, part2Solution);

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
