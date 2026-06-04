# codemod-clean

[![npm version](https://img.shields.io/npm/v/codemod-clean)](https://www.npmjs.com/package/codemod-clean)
[![npm downloads](https://img.shields.io/npm/dw/codemod-clean)](https://www.npmjs.com/package/codemod-clean)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

Codemod Engine + Monorepo Static Analysis

A codemod tool for JavaScript, TypeScript, and Vue that automatically detects and removes console statements, unused variables, unused imports, and unused classes, while also analyzing project structure and dependencies.

## Features

- 🧹 **Console statement cleanup & analysis**  
  Detect and optionally remove `console.log`, `console.error`, `console.warn`, and other console APIs with detailed reporting.

- 🗑️ **Dead code detection**  
  Identify and analyze unused variables across files and scopes, including cross-file references.

- 📦 **Import optimization**  
  Detect and remove unused or partially used imports across ES Modules and CommonJS syntax.

- 🏷 **Class usage analysis**  
  Detect unused class declarations and analyze class-level dead code.

- 🎯 **Multi-language support**  
  Full support for JavaScript, TypeScript, and Vue Single File Components (SFC).

- 🔍 **Safe execution (dry-run mode)**  
  Preview all changes before applying them to ensure safe refactoring.

- 📊 **Structured reporting system**  
  Output both human-readable (stylish CLI view) and machine-readable JSON reports for CI/CD integration.

- 🌳 **Project & monorepo structure analysis**  
  Visualize workspace structure, analyze package relationships, and inspect internal vs external dependencies in monorepo environments.

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

| Option      | Description                               | Default |
| ----------- | ----------------------------------------- | ------- |
| `--tree`    | Output tree view of the project structure | `true`  |
| `--json`    | Output results in JSON format             | `false` |
| `--package` | Package-level analysis (default)          | `true`  |
| `--deps`    | Monorepo dependency graph analysis        | `false` |
| `--shared`  | Monorepo shared package analysis          | `false` |

## Rules

### run

- `--fix` and `--dry` cannot be used together.
- `--json` and `--stylish` cannot be used together.
- Default behavior: `dry + stylish`

### analyze

- `--tree` and `--json` cannot be used together.
- `--package` `--shared` `--deps` cannot be used together.
- Default behavior: `tree + package`

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
codemod-clean analyze ./src --json --shared
```
