import { validateDimension } from "./validation";

/**
 * Sorts a package into STANDARD, SPECIAL, or REJECTED category based on its
 * dimensions and mass.
 *
 * A package is **bulky** if:
 * - Volume >= 1,000,000 cm³ (width × height × length), OR
 * - Any single dimension >= 150 cm
 *
 * A package is **heavy** if:
 * - Mass >= 20 kg
 *
 * Sorting rules:
 * - STANDARD: Not bulky and not heavy
 * - SPECIAL: Either bulky OR heavy (but not both)
 * - REJECTED: Both bulky AND heavy
 *
 * @param width - Package width in centimeters (must be positive and finite)
 * @param height - Package height in centimeters (must be positive and finite)
 * @param length - Package length in centimeters (must be positive and finite)
 * @param mass - Package mass in kilograms (must be positive and finite)
 * @returns "STANDARD", "SPECIAL", or "REJECTED"
 * @throws {PackageValidationError} When any input is invalid
 *
 * @example
 * ```typescript
 * // Standard package (small and light)
 * sort(50, 50, 50, 10);  // Returns: "STANDARD"
 *
 * // Bulky package (tall dimension)
 * sort(150, 50, 50, 10);  // Returns: "SPECIAL"
 *
 * // Heavy package
 * sort(50, 50, 50, 25);  // Returns: "SPECIAL"
 *
 * // Rejected package (bulky AND heavy)
 * sort(150, 150, 150, 25);  // Returns: "REJECTED"
 *
 * // Invalid input
 * sort(-10, 50, 50, 10);  // Throws: PackageValidationError
 * ```
 */
export function sort(
	width: number,
	height: number,
	length: number,
	mass: number,
): "STANDARD" | "SPECIAL" | "REJECTED" {
	validateDimension(width, "width");
	validateDimension(height, "height");
	validateDimension(length, "length");
	validateDimension(mass, "mass");

	const volume = width * height * length;
	const isBulky =
		volume >= 1_000_000 || width >= 150 || height >= 150 || length >= 150;
	const isHeavy = mass >= 20;

	if (isBulky && isHeavy) {
		return "REJECTED";
	}
	if (isBulky || isHeavy) {
		return "SPECIAL";
	}
	return "STANDARD";
}
