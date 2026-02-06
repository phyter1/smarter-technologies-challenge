# Package Sort System

A package sorting system that classifies packages based on dimensions and mass into three categories: STANDARD, SPECIAL, or REJECTED.

## Quick Start

### Installation

```bash
bun install
```

### Command Line Usage

```bash
# Sort a package
bun run sort <width> <height> <length> <mass>

# Examples
bun run sort 50 50 50 10       # STANDARD
bun run sort 150 50 50 10      # SPECIAL (bulky)
bun run sort 50 50 50 25       # SPECIAL (heavy)
bun run sort 150 150 150 25    # REJECTED (bulky AND heavy)

# Help
bun run sort --help
```

### Programmatic Usage

```typescript
import { sort, PackageValidationError } from "./src/index";

// Basic usage
const result = sort(50, 50, 50, 10);  // Returns: "STANDARD"

// Error handling
try {
  sort(-10, 50, 50, 10);
} catch (error) {
  if (error instanceof PackageValidationError) {
    console.error(error.message);  // "width must be positive, received -10"
  }
}
```

### Run Tests

```bash
bun test              # Run all tests (34 tests, 92 assertions)
bun test --coverage   # Run tests with coverage report (100% coverage)
bun run check         # Lint and format code
```

## Sorting Rules

### Bulky

A package is **bulky** if:

- Volume ≥ 1,000,000 cm³ (width × height × length), **OR**
- Any dimension ≥ 150 cm

### Heavy

A package is **heavy** if:

- Mass ≥ 20 kg

### Results

| Bulky | Heavy | Result     |
|-------|-------|------------|
| No    | No    | STANDARD   |
| Yes   | No    | SPECIAL    |
| No    | Yes   | SPECIAL    |
| Yes   | Yes   | REJECTED   |

## API Reference

### `sort(width, height, length, mass)`

**Parameters:**

- `width` (number): Width in cm, must be positive and finite
- `height` (number): Height in cm, must be positive and finite
- `length` (number): Length in cm, must be positive and finite
- `mass` (number): Mass in kg, must be positive and finite

**Returns:** `"STANDARD"` | `"SPECIAL"` | `"REJECTED"`

**Throws:** `PackageValidationError` for invalid input (negative, zero, NaN, Infinity, wrong type)

## Examples

### Boundary Conditions

```typescript
// Dimension boundary (150 cm)
sort(150, 50, 50, 10);     // "SPECIAL"
sort(149.99, 50, 50, 10);  // "STANDARD"

// Mass boundary (20 kg)
sort(50, 50, 50, 20);      // "SPECIAL"
sort(50, 50, 50, 19.99);   // "STANDARD"

// Volume boundary (1,000,000 cm³)
sort(100, 100, 100, 10);   // "SPECIAL"
sort(99.99, 100, 100, 10); // "STANDARD"
```

### Real-World Scenarios

```typescript
sort(30, 20, 10, 0.5);      // STANDARD - shoebox
sort(80, 40, 180, 15);      // SPECIAL - tall bookshelf
sort(40, 40, 40, 50);       // SPECIAL - heavy machinery part
sort(200, 150, 100, 250);   // REJECTED - industrial equipment
sort(120, 120, 80, 15);     // SPECIAL - pallet (large volume)
```

## CLI Error Handling

The CLI provides clear error messages:

```bash
bun run sort -10 50 50 10
# Error: Validation Error: width must be positive, received -10

bun run sort abc 50 50 10
# Error: Invalid width "abc" - must be a number

bun run sort 50 50
# Error: Expected 4 arguments (width, height, length, mass)
```

---

## Implementation Details

### Input Validation

All inputs are validated before processing:

- Must be numbers (not strings, null, undefined, etc.)
- Must be finite (not NaN or Infinity)
- Must be positive (> 0)
- Must not exceed Number.MAX_SAFE_INTEGER

Validation errors throw `PackageValidationError` with descriptive messages.

### Testing

**34 test suites with 92 assertions** achieving **100% code coverage**:

- **Valid inputs**: All sorting categories and combinations
- **Boundary conditions**: Exact thresholds (150cm, 20kg, 1M cm³) and decimal precision
- **Input validation**: Negative, zero, NaN, Infinity, wrong types, extreme values
- **Edge cases**: Floating-point precision, very small/large numbers

```bash
bun test              # Run tests
bun test --coverage   # Run tests with coverage report
```

**Coverage Report:**

```txt
-------------------|---------|---------|-------------------
File               | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|---------|-------------------
All files          |  100.00 |  100.00 |
 src/error.ts      |  100.00 |  100.00 |
 src/index.ts      |  100.00 |  100.00 |
 src/validation.ts |  100.00 |  100.00 |
-------------------|---------|---------|-------------------
```

### Project Structure

```txt
challenge/
├── src/
│   ├── error.ts       # PackageValidationError class
│   ├── validation.ts  # Input validation logic
│   ├── index.ts       # Main sort function
│   ├── index.test.ts  # Comprehensive test suite
│   └── cli.ts         # Command-line interface
├── biome.json         # Linter/formatter config
├── package.json       # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

**File Breakdown:**

- **error.ts**: Custom error class for validation failures
- **validation.ts**: Validates dimensions and mass (positive, finite, within safe range)
- **index.ts**: Core sorting logic that determines STANDARD/SPECIAL/REJECTED
- **index.test.ts**: 34 test suites with 92 assertions
- **cli.ts**: Command-line interface with help, error handling, and exit codes

### Available Scripts

```bash
bun run sort <w> <h> <l> <m>  # Sort via CLI
bun test                      # Run tests
bun test --coverage           # Run tests with coverage report
bun run lint                  # Lint code
bun run format                # Format code
bun run check                 # Lint + format with auto-fix
```

### Code Quality

- **TypeScript** for type safety
- **Bun** for runtime and testing
- **Biome** for linting and formatting
- **Comprehensive validation** for runtime safety

### Design Notes

**Why validate all inputs?**
Fail fast with clear errors rather than producing incorrect results. Critical for production reliability and debugging.

**Why custom error class?**
`PackageValidationError` allows calling code to distinguish validation errors from other errors for proper HTTP status codes (400 vs 500).

**Performance considerations?**
Current implementation prioritizes clarity over micro-optimizations. Volume is always calculated even if a dimension exceeds 150cm (costs 2 multiplications but improves readability). For single-package sorting, this overhead is negligible.

## Requirements

- Bun v1.2.21+
- TypeScript v5+
