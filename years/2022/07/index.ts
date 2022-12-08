import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import { log, logSolution, trace } from "../../../util/log";
import { performance } from "perf_hooks";

const YEAR = 2022;
const DAY = 7;

// solution path: Z:\advent-of-code\years\2022\07\index.ts
// data path    : Z:\advent-of-code\years\2022\07\data.txt
// problem url  : https://adventofcode.com/2022/day/7

type file = {
	name: string,
	size: number
}

type dir = {
	files: file[],
	subDirs: dir[],
	name: string,
	parentDir?: dir,
	size?: number
}

async function p2022day7_part1(input: string, ...params: any[]) {
	
	let comms = input.split("$ ");
	let lines = comms.map((l) => l.split("\n"));

	let fileSys: dir = {
		files: [],
		subDirs: [],
		name: "/"
	}

	let curDir = {...fileSys};

	while(lines.length) {
		curDir = readCommand(lines, curDir)
	}

	return getSmallSizes(fileSys, 100000);	
}


function readCommand(lines: string[][], curDir: dir): dir {
	if(!lines.length) curDir;
	let dirPointer: dir | undefined = curDir;

	let exec = lines.shift();
	if(!exec) return curDir;

	if(exec[0].match(/cd.*/)) {
		// cd will never be multi-line
		let target = exec[0].split(" ")[1];
		if(target == "..")
			if(curDir.parentDir)
				return curDir.parentDir;
			else
				throw Error("Broken parent");
		else if (target == "/") {
			let tmp = curDir;
			while(tmp?.parentDir) {
				tmp = tmp.parentDir;
			}
			return tmp;
		} else {
			dirPointer = curDir.subDirs.find((d) => d.name == target)
			if(!dirPointer) {
				let newDir: dir = {
					name: target,
					files: [],
					parentDir: curDir,
					subDirs: []
				}
				curDir.subDirs.push(newDir);
				dirPointer = newDir;
			}
		}
	} else if (exec[0] == "ls") {
		// While ls will be multi-line, unless it's empty
		exec.shift();
		exec.forEach(entry => {
			if(entry.length) {
				let details = entry.split(" ");
				if(details[0] == "dir") {
					curDir.subDirs.push({
						files: [],
						subDirs: [],
						parentDir: curDir,
						name: details[1]
					})
				} else {
					curDir.files.push({
						name: details[1],
						size: parseInt(details[0])
					})
				}
			}
		});
	}

	return dirPointer;
}

function getSizes(dir: dir) {
	let size = dir.size ? dir.size : 0;
	dir.subDirs.forEach(subDir => {
		subDir.size = getSizes(subDir)
		size += subDir.size;
	});
	dir.files.forEach(file => {
		size += file.size;
	});
	return size;
}

function getSmallSizes(dir: dir, maxSize?: number) {
	let matchSum = 0;
	if(!dir.size) dir.size = getSizes(dir);
	if(maxSize && dir.size <= maxSize) {
		matchSum += dir.size;
	}
	dir.subDirs.forEach(subDir => {
		matchSum += getSmallSizes(subDir, maxSize);
	});
	return matchSum;
}


async function p2022day7_part2(input: string, ...params: any[]) {
	let comms = input.split("$ ");
	let lines = comms.map((l) => l.split("\n"));

	let fileSys: dir = {
		files: [],
		subDirs: [],
		name: "/"
	}

	let curDir = {...fileSys};

	while(lines.length) {
		curDir = readCommand(lines, curDir)
	}
	
	fileSys.size = getSizes(fileSys);

	let req = 30000000 - (70000000 - fileSys.size);

	let smallest = findSmallest(fileSys, {...fileSys}, req);

	return smallest.size;
}


function findSmallest(dir: dir, smallest: dir, minSize: number) {
	if(!dir.size || !smallest.size) return smallest;
	if(dir.size < minSize) return smallest;
	
	dir.subDirs.forEach(sub => {
		smallest = findSmallest(sub, smallest, minSize);
	});
	if(dir.size < smallest.size) smallest = dir;
	return smallest;
}

async function run() {
	const part1tests: TestCase[] = [{
		input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
		  expected:"95437"
	}];
	const part2tests: TestCase[] = [{input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
			  expected:"24933642"}];

	// Run tests
	test.beginTests();
	await test.section(async () => {
		for (const testCase of part1tests) {
			test.logTestResult(testCase, String(await p2022day7_part1(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	await test.section(async () => {
		for (const testCase of part2tests) {
			test.logTestResult(testCase, String(await p2022day7_part2(testCase.input, ...(testCase.extraArgs || []))));
		}
	});
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2022day7_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now()
	const part2Solution = String(await p2022day7_part2(input));
	const part2After = performance.now();

	logSolution(7, 2022, part1Solution, part2Solution);

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
