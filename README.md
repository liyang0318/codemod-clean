# codemod-clean

A codemod tool that automatically removes console statements, unused variables, and unused imports in JavaScript, TypeScript, and Vue codebases.

## Features

- 🧹 Remove console statements (console.log, console.error, etc.)
- 🗑️ Remove unused variables
- 📦 Remove unused imports
- 🎯 Supports JS / TS / Vue files
- 🔍 Dry-run mode for safe preview
- 📊 Structured report output (stylish / JSON)

## Installation

```bash
npm install -g codemod-clean
```

## Options

| Option      | Description                                       | Default |
| ----------- | ------------------------------------------------- | ------- |
| `--dry`     | Preview changes without modifying files (default) | `true`  |
| `--fix`     | Automatically apply fixes to the code             | `false` |
| `--json`    | Output results in JSON format                     | `false` |
| `--stylish` | Output human-readable report (default)            | `true`  |

---

## Rules

- `--fix` and `--dry` are mutually exclusive
- `--json` and `--stylish` are mutually exclusive
- Default behavior: `dry + stylish`

---

## Usage

```bash
codemod-clean run <path> [options]

# or use npx directly
npx codemod-clean run <path> [options]
```

### Examples

```bash
# Preview changes (safe mode)
codemod-clean run ./src

# Apply fixes
codemod-clean run ./src --fix

# JSON output (for CI)
codemod-clean run ./src --json
```
