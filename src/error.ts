/**
 * Custom error thrown when package dimension or mass validation fails.
 *
 * This error is thrown when input values are invalid (negative, zero, NaN,
 * Infinity, wrong type, or exceed MAX_SAFE_INTEGER).
 *
 * @example
 * ```typescript
 * try {
 *   sort(-10, 50, 50, 10);
 * } catch (error) {
 *   if (error instanceof PackageValidationError) {
 *     console.error(error.message); // "width must be positive, received -10"
 *   }
 * }
 * ```
 */
export class PackageValidationError extends Error {
	/**
	 * Creates a new PackageValidationError.
	 *
	 * @param message - Detailed error message explaining what went wrong
	 */
	constructor(message: string) {
		super(message);
		this.name = "PackageValidationError";
	}
}
