#!/usr/bin/env bun

import { PackageValidationError } from "./error";
import { sort } from "./index";

/**
 * Prints CLI usage instructions to stdout.
 *
 * Displays the command syntax, argument descriptions, example usage,
 * and expected output format.
 */
function printUsage() {
	console.log(`
Usage: bun run sort <width> <height> <length> <mass>

Arguments:
  width   Package width in centimeters (cm)
  height  Package height in centimeters (cm)
  length  Package length in centimeters (cm)
  mass    Package mass in kilograms (kg)

Example:
  bun run sort 100 100 100 20

Output:
  Returns one of: STANDARD, SPECIAL, or REJECTED
`);
}

/**
 * Main CLI entry point for package sorting.
 *
 * Parses command-line arguments, validates input, calls the sort function,
 * and outputs the result or error messages.
 *
 * Exit codes:
 * - 0: Success
 * - 1: Error (invalid arguments, validation failure, or unexpected error)
 *
 * @example
 * ```bash
 * bun run sort 50 50 50 10        # Outputs: STANDARD
 * bun run sort 150 50 50 10       # Outputs: SPECIAL
 * bun run sort -10 50 50 10       # Outputs: Validation Error
 * bun run sort --help             # Outputs: Usage instructions
 * ```
 */
function main() {
	const args = process.argv.slice(2);

	if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
		printUsage();
		process.exit(0);
	}

	if (args.length !== 4) {
		console.error("Error: Expected 4 arguments (width, height, length, mass)");
		console.error(`Received: ${args.length} argument(s)\n`);
		printUsage();
		process.exit(1);
	}

	const [widthStr, heightStr, lengthStr, massStr] = args;
	const width = Number.parseFloat(widthStr);
	const height = Number.parseFloat(heightStr);
	const length = Number.parseFloat(lengthStr);
	const mass = Number.parseFloat(massStr);

	// Check if parsing failed
	if (Number.isNaN(width)) {
		console.error(`Error: Invalid width "${widthStr}" - must be a number`);
		process.exit(1);
	}
	if (Number.isNaN(height)) {
		console.error(`Error: Invalid height "${heightStr}" - must be a number`);
		process.exit(1);
	}
	if (Number.isNaN(length)) {
		console.error(`Error: Invalid length "${lengthStr}" - must be a number`);
		process.exit(1);
	}
	if (Number.isNaN(mass)) {
		console.error(`Error: Invalid mass "${massStr}" - must be a number`);
		process.exit(1);
	}

	try {
		const result = sort(width, height, length, mass);
		console.log(result);
		process.exit(0);
	} catch (error) {
		if (error instanceof PackageValidationError) {
			console.error(`Validation Error: ${error.message}`);
			process.exit(1);
		}
		console.error(`Unexpected Error: ${error}`);
		process.exit(1);
	}
}

main();
