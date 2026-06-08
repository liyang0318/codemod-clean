# codemod-clean

[![npm version](https://img.shields.io/npm/v/codemod-clean)](https://www.npmjs.com/package/codemod-clean)
[![npm downloads](https://img.shields.io/npm/dw/codemod-clean)](https://www.npmjs.com/package/codemod-clean)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

---

## ⚡ Monorepo-Aware Code Analysis & Codemod Engine

codemod-clean is a static analysis and codemod tool for JavaScript, TypeScript, and Vue that helps you understand, clean, and optimize large codebases and monorepos.

It goes beyond linting by analyzing real dependency relationships across packages, not just file-level rules.

---

## 🚀 Why codemod-clean?

Most tools tell you:

- ❌ You have unused code
- ❌ You have unused imports

codemod-clean tells you:

- ✅ @packages/x-axios is used by 4 packages → critical shared dependency
- ✅ @packages/utils is highly coupled → architecture hotspot
- ✅ @packages/i18n is unused → safe to remove
- ✅ Your monorepo dependency graph is not what your folder structure suggests

---

## 🔥 Key Insights

- Identify critical shared packages
- Detect orphan (unused) packages
- Reveal architecture coupling hotspots
- Understand real dependency graph
- Find risk points in monorepo structure

---

## 📊 Example Output

```text
@packages/eslint-config-custom (5)
  used by:
    - @packages/theme
    - @packages/utils
    - @packages/a-axios
    - @packages/a-uploader
    - @packages/a-components

@packages/a-axios (4)
  used by:
    - @application/management
    - @application/approval
    - @packages/api
    - @packages/a-uploader

@packages/utils (3)
  used by:
    - @application/management
    - @application/approval
    - @packages/a-components
```

---

## 🧹 Features

- 🧹 Console statement detection & cleanup (console.log, console.error, etc.)
- 🗑️ Unused variable detection (cross-file aware)
- 📦 Import optimization (ESM / CJS / Vue SFC)
- 🏷️ Unused class detection
- 🎯 Full support for JavaScript / TypeScript / Vue

---

## 🌳 Monorepo Analysis (Core Feature)

- Workspace structure visualization
- Dependency graph analysis (--deps)
- Shared package analysis (--shared)
- Package analysis (--package)
- Orphan package detection
- Internal vs external dependency mapping

---

## 🔍 Safe Execution

- Dry-run mode by default
- Safe preview before applying changes
- CI/CD friendly JSON output
- Optional auto-fix mode (--fix)

---

## 📦 Installation

```bash
npm install -g codemod-clean
```

---

## 🚀 Usage

```bash
# 1.Analyze project structure （default --tree）
codemod-clean analyze

# 2.Show project json output
codemod-clean analyze --json

# 3.Package analysis
codemod-clean analyze --package

# 4.Dependency graph analysis
codemod-clean analyze --deps

# 5.Shared packages analysis
codemod-clean analyze --shared

# 6.Clean code (dry-run by default)
codemod-clean run ./src

# 7.Apply fixes
codemod-clean run ./src --fix

# 8.JSON output (CI usage)
codemod-clean analyze --json --shared
```

---

## ⚙️ Options

### run

| Option    | Description                       | Default |
| --------- | --------------------------------- | ------- |
| --dry     | Preview changes without modifying | true    |
| --fix     | Apply fixes automatically         | false   |
| --json    | Output JSON format                | false   |
| --stylish | Human-readable output             | true    |

---

### analyze

| Option    | Description                 | Default |
| --------- | --------------------------- | ------- |
| --tree    | Show project structure tree | true    |
| --json    | Output JSON format          | false   |
| --package | Package analysis            | true    |
| --deps    | Dependency graph analysis   | false   |
| --shared  | Shared package analysis     | false   |

---

## 📌 Rules

### run

- `--fix` and `--dry` cannot be used together.
- `--json` and `--stylish` cannot be used together.
- Default behavior: `dry + stylish`

---

### analyze

- `--tree` and `--json` cannot be used together.
- `--package` `--shared` `--deps` cannot be used together.
- Default behavior: `tree + package`

---

## ⚙️ Mental Model

codemod-clean treats your project as a dependency graph, not a folder tree.

Files → symbols → modules → packages → workspace graph

You don’t just clean code — you understand architecture

---

## 🧪 Example Use Cases

- Find safe-to-delete packages in a monorepo
- Detect architecture coupling issues
- Identify shared utility hotspots
- Clean unused code before production release
- Understand large-scale project structure instantly

---

## 📈 Roadmap

- Cycle dependency detection
- Impact analysis (--impact)
- Hot package ranking (--hot)
- Layer violation detection
- Migration codemods (API refactors)
