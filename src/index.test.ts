import { describe, expect, it } from "bun:test";
import { PackageValidationError } from "./error";
import { sort } from "./index";

describe("sort", () => {
	describe("valid inputs", () => {
		it("should return STANDARD for non-bulky and non-heavy packages", () => {
			expect(sort(50, 50, 50, 10)).toBe("STANDARD");
			expect(sort(1, 1, 1, 0.1)).toBe("STANDARD");
			expect(sort(149, 10, 10, 19)).toBe("STANDARD");
		});

		it("should return SPECIAL for bulky but not heavy packages", () => {
			expect(sort(150, 50, 50, 10)).toBe("SPECIAL");
			expect(sort(50, 150, 50, 10)).toBe("SPECIAL");
			expect(sort(50, 50, 150, 10)).toBe("SPECIAL");
			expect(sort(100, 100, 100, 10)).toBe("SPECIAL");
		});

		it("should return SPECIAL for heavy but not bulky packages", () => {
			expect(sort(50, 50, 50, 20)).toBe("SPECIAL");
			expect(sort(50, 50, 50, 25)).toBe("SPECIAL");
			expect(sort(10, 10, 10, 100)).toBe("SPECIAL");
		});

		it("should return REJECTED for packages that are both bulky and heavy", () => {
			expect(sort(150, 150, 150, 20)).toBe("REJECTED");
			expect(sort(150, 50, 50, 20)).toBe("REJECTED");
			expect(sort(50, 150, 50, 20)).toBe("REJECTED");
			expect(sort(50, 50, 150, 20)).toBe("REJECTED");
			expect(sort(100, 100, 100, 20)).toBe("REJECTED");
			expect(sort(150, 150, 150, 25)).toBe("REJECTED");
			expect(sort(150, 50, 50, 25)).toBe("REJECTED");
			expect(sort(50, 150, 50, 25)).toBe("REJECTED");
			expect(sort(50, 50, 150, 25)).toBe("REJECTED");
			expect(sort(100, 100, 100, 25)).toBe("REJECTED");
		});
	});

	describe("boundary conditions", () => {
		it("should handle exact dimension boundary (150 cm)", () => {
			expect(sort(150, 1, 1, 1)).toBe("SPECIAL");
			expect(sort(1, 150, 1, 1)).toBe("SPECIAL");
			expect(sort(1, 1, 150, 1)).toBe("SPECIAL");
			expect(sort(149.99, 1, 1, 1)).toBe("STANDARD");
			expect(sort(150.01, 1, 1, 1)).toBe("SPECIAL");
		});

		it("should handle exact mass boundary (20 kg)", () => {
			expect(sort(1, 1, 1, 20)).toBe("SPECIAL");
			expect(sort(1, 1, 1, 19.99)).toBe("STANDARD");
			expect(sort(1, 1, 1, 20.01)).toBe("SPECIAL");
		});

		it("should handle exact volume boundary (1,000,000 cm³)", () => {
			// 100 * 100 * 100 = 1,000,000 (exactly at boundary)
			expect(sort(100, 100, 100, 1)).toBe("SPECIAL");
			// 99.99 * 100 * 100 = 999,900 (just under)
			expect(sort(99.99, 100, 100, 1)).toBe("STANDARD");
			// 100.01 * 100 * 100 = 1,000,100 (just over)
			expect(sort(100.01, 100, 100, 1)).toBe("SPECIAL");
			// 100 * 100 * 100.01 = 1,000,100 (just over)
			expect(sort(100, 100, 100.01, 1)).toBe("SPECIAL");
			// 99 * 101 * 100.99 = 1,009,899 (over but no dimension >= 150)
			expect(sort(99, 101, 100.99, 1)).toBe("SPECIAL");
		});

		it("should handle combinations at boundaries", () => {
			expect(sort(150, 1, 1, 20)).toBe("REJECTED");
			expect(sort(100, 100, 100, 20)).toBe("REJECTED");
			expect(sort(149.99, 1, 1, 19.99)).toBe("STANDARD");
		});
	});

	describe("input validation - negative values", () => {
		it("should reject negative width", () => {
			expect(() => sort(-1, 50, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(-1, 50, 50, 10)).toThrow("width must be positive");
		});

		it("should reject negative height", () => {
			expect(() => sort(50, -1, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, -1, 50, 10)).toThrow("height must be positive");
		});

		it("should reject negative length", () => {
			expect(() => sort(50, 50, -1, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, -1, 10)).toThrow("length must be positive");
		});

		it("should reject negative mass", () => {
			expect(() => sort(50, 50, 50, -1)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, 50, -1)).toThrow("mass must be positive");
		});
	});

	describe("input validation - zero values", () => {
		it("should reject zero width", () => {
			expect(() => sort(0, 50, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(0, 50, 50, 10)).toThrow("width must be positive");
		});

		it("should reject zero height", () => {
			expect(() => sort(50, 0, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, 0, 50, 10)).toThrow("height must be positive");
		});

		it("should reject zero length", () => {
			expect(() => sort(50, 50, 0, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, 0, 10)).toThrow("length must be positive");
		});

		it("should reject zero mass", () => {
			expect(() => sort(50, 50, 50, 0)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, 50, 0)).toThrow("mass must be positive");
		});
	});

	describe("input validation - NaN values", () => {
		it("should reject NaN width", () => {
			expect(() => sort(NaN, 50, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(NaN, 50, 50, 10)).toThrow(
				"width must be a finite number",
			);
		});

		it("should reject NaN height", () => {
			expect(() => sort(50, NaN, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, NaN, 50, 10)).toThrow(
				"height must be a finite number",
			);
		});

		it("should reject NaN length", () => {
			expect(() => sort(50, 50, NaN, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, NaN, 10)).toThrow(
				"length must be a finite number",
			);
		});

		it("should reject NaN mass", () => {
			expect(() => sort(50, 50, 50, NaN)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, 50, NaN)).toThrow(
				"mass must be a finite number",
			);
		});
	});

	describe("input validation - Infinity values", () => {
		it("should reject Infinity width", () => {
			expect(() => sort(Infinity, 50, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(Infinity, 50, 50, 10)).toThrow(
				"width must be a finite number",
			);
		});

		it("should reject Infinity height", () => {
			expect(() => sort(50, Infinity, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, Infinity, 50, 10)).toThrow(
				"height must be a finite number",
			);
		});

		it("should reject Infinity length", () => {
			expect(() => sort(50, 50, Infinity, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, Infinity, 10)).toThrow(
				"length must be a finite number",
			);
		});

		it("should reject Infinity mass", () => {
			expect(() => sort(50, 50, 50, Infinity)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, 50, Infinity)).toThrow(
				"mass must be a finite number",
			);
		});

		it("should reject negative Infinity", () => {
			expect(() => sort(-Infinity, 50, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, -Infinity, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, -Infinity, 10)).toThrow(PackageValidationError);
			expect(() => sort(50, 50, 50, -Infinity)).toThrow(PackageValidationError);
		});
	});

	describe("input validation - non-number types", () => {
		it("should reject non-number width", () => {
			expect(() => sort("50" as unknown as number, 50, 50, 10)).toThrow(
				PackageValidationError,
			);
			expect(() => sort("50" as unknown as number, 50, 50, 10)).toThrow(
				"width must be a number, received string",
			);
		});

		it("should reject non-number height", () => {
			expect(() => sort(50, null as unknown as number, 50, 10)).toThrow(
				PackageValidationError,
			);
			expect(() => sort(50, null as unknown as number, 50, 10)).toThrow(
				"height must be a number, received object",
			);
		});

		it("should reject non-number length", () => {
			expect(() => sort(50, 50, undefined as unknown as number, 10)).toThrow(
				PackageValidationError,
			);
			expect(() => sort(50, 50, undefined as unknown as number, 10)).toThrow(
				"length must be a number, received undefined",
			);
		});

		it("should reject non-number mass", () => {
			expect(() => sort(50, 50, 50, {} as unknown as number)).toThrow(
				PackageValidationError,
			);
			expect(() => sort(50, 50, 50, {} as unknown as number)).toThrow(
				"mass must be a number, received object",
			);
		});
	});

	describe("input validation - extreme values", () => {
		it("should reject values exceeding MAX_SAFE_INTEGER", () => {
			const tooBig = Number.MAX_SAFE_INTEGER + 1;
			expect(() => sort(tooBig, 50, 50, 10)).toThrow(PackageValidationError);
			expect(() => sort(tooBig, 50, 50, 10)).toThrow(
				"width exceeds maximum safe value",
			);
		});

		it("should handle very small positive numbers", () => {
			expect(sort(0.001, 0.001, 0.001, 0.001)).toBe("STANDARD");
			expect(sort(0.0001, 10000, 10000, 0.001)).toBe("SPECIAL");
		});

		it("should handle large but valid numbers", () => {
			expect(sort(1000, 1000, 1000, 1000)).toBe("REJECTED");
			expect(sort(10000, 10000, 10000, 10000)).toBe("REJECTED");
		});
	});

	describe("decimal precision edge cases", () => {
		it("should handle floating point precision near boundaries", () => {
			expect(sort(149.9999999999, 1, 1, 1)).toBe("STANDARD");
			expect(sort(150.0000000001, 1, 1, 1)).toBe("SPECIAL");
			expect(sort(1, 1, 1, 19.9999999999)).toBe("STANDARD");
			expect(sort(1, 1, 1, 20.0000000001)).toBe("SPECIAL");
		});

		it("should handle volume calculations with decimals", () => {
			expect(sort(99.999, 100, 100, 1)).toBe("STANDARD");
			expect(sort(100.001, 100, 100, 1)).toBe("SPECIAL");
		});
	});
});
