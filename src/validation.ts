import { PackageValidationError } from "./error";

/**
 * Validates that a dimension or mass value is valid for package sorting.
 *
 * Ensures the value is:
 * - A number (not string, null, undefined, etc.)
 * - Finite (not NaN or Infinity)
 * - Positive (greater than zero)
 * - Within safe integer range (not exceeding Number.MAX_SAFE_INTEGER)
 *
 * @param value - The numeric value to validate (dimension in cm or mass in kg)
 * @param name - The parameter name for error messages (e.g., "width", "mass")
 * @throws {PackageValidationError} When validation fails with a descriptive message
 *
 * @example
 * ```typescript
 * validateDimension(50, "width");      // OK
 * validateDimension(-10, "width");     // Throws: "width must be positive, received -10"
 * validateDimension(NaN, "height");    // Throws: "height must be a finite number, received NaN"
 * validateDimension("50", "length");   // Throws: "length must be a number, received string"
 * ```
 */
export function validateDimension(value: number, name: string): void {
	if (typeof value !== "number") {
		throw new PackageValidationError(
			`${name} must be a number, received ${typeof value}`,
		);
	}
	if (!Number.isFinite(value)) {
		throw new PackageValidationError(
			`${name} must be a finite number, received ${value}`,
		);
	}
	if (value <= 0) {
		throw new PackageValidationError(
			`${name} must be positive, received ${value}`,
		);
	}
	if (value > Number.MAX_SAFE_INTEGER) {
		throw new PackageValidationError(`${name} exceeds maximum safe value`);
	}
}
