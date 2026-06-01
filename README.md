# codemod-clean

[![npm version](https://img.shields.io/npm/v/codemod-clean)](https://www.npmjs.com/package/codemod-clean)
[![npm downloads](https://img.shields.io/npm/dw/codemod-clean)](https://www.npmjs.com/package/codemod-clean)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

A codemod tool that automatically removes console statements, unused variables, and unused imports in JavaScript, TypeScript, and Vue codebases.

## Features

- 🧹 Remove console statements (console.log, console.error, etc.)
- 🗑️ Remove unused variables
- 📦 Remove unused imports
- 🎯 Supports JS / TS / Vue files
- 🔍 Dry-run mode for safe preview
- 📊 Structured report output (stylish / JSON)
- 🌳 Tree view output for project analysis

## Installation

```bash
npm install -g codemod-clean
```

## Options

### run Options

| Option      | Description                                       | Default |
| ----------- | ------------------------------------------------- | ------- |
| `--dry`     | Preview changes without modifying files (default) | `true`  |
| `--fix`     | Automatically apply fixes to the code             | `false` |
| `--json`    | Output results in JSON format                     | `false` |
| `--stylish` | Output human-readable report (default)            | `true`  |

### analyze Options

| Option   | Description                               | Default |
| -------- | ----------------------------------------- | ------- |
| `--tree` | Output tree view of the project structure | `true`  |
| `--json` | Output results in JSON format             | `false` |

---

## Rules

### run

- `--fix` and `--dry` cannot be used together.
- `--json` and `--stylish` cannot be used together.
- Default behavior: `dry + stylish`

### analyze

- `--tree` and `--json` cannot be used together.
- Default behavior: `tree`

---

## Usage

### Clean Code

```bash
codemod-clean run [path] [options]

# or use npx directly
npx codemod-clean run [path] [options]
```

### Analyze Project

```bash
codemod-clean analyze [path] [options]

# or use npx directly
npx codemod-clean analyze [path] [options]
```

## Examples

### Clean Code

```bash
# Preview changes (safe mode)
codemod-clean run ./src

# Apply fixes
codemod-clean run ./src --fix

# JSON output
codemod-clean run ./src/index.js --json
```

### Analyze Project

```bash
# Analyze current directory
codemod-clean analyze

# Analyze a specific folder
codemod-clean analyze ./src

# Show project tree
codemod-clean analyze ./src --tree

# JSON output
codemod-clean analyze ./src --json
```
