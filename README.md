# codemod-clean

A powerful codemod tool to automatically clean up console statements, unused variables, and unused imports in JavaScript/TypeScript/Vue code.

## Features

- 🧹 Remove console.log, console.error
- 🗑️ Delete unused variables
- 📦 Remove unused imports
- 🎯 Support JS, TS, Vue files
- 🔍 Dry run mode to preview changes
- 📊 Detailed report generation

## Installation

```bash
# Global installation
npm install -g codemod-clean
```

## Options

| Option  | Description                             | Default |
| ------- | --------------------------------------- | ------- |
| `--dry` | Preview changes without modifying files | `true`  |
| `--fix` | Automatically apply fixes to the code   | `false` |

## Usage

```bash
# Global usage
codemod-clean run <path> [options]

# Or use npx directly
npx codemod-clean run <path> [options]
```

### Examples

```bash
# Preview changes without modifying files
codemod-clean run ./src --dry

# Automatically fix all issues
codemod-clean run ./src --fix
```
