#!/usr/bin/env node

const { Command } = require("commander");
const pkg = require("../package.json");
const run = require("../src/core/runner.js");
const analyze = require("../src/core/analyzer.js");
const { validateOptions } = require("../src/utils/index.js");

const program = new Command();

program.name("codemod-clean").version(pkg.version);

program
  .command("run")
  .argument("[target]")
  .option("--dry", "preview without writing files (default)")
  .option("--fix", "apply changes to files")
  .option("--stylish", "output human-readable format (default)")
  .option("--json", "output JSON format")
  .description(
    "analyze and clean the code (options: --dry, --fix, --stylish, --json)",
  )
  .action((target, options) => {
    validateOptions(options, "run");

    run(target, options);
  });

program
  .command("analyze")
  .argument("[target]")
  .option("--tree", "output tree format (default)")
  .option("--json", "output JSON format")
  .option("--package", "package-level analysis (default)")
  .option("--deps", "monorepo dependency graph analysis")
  .option("--shared", "monorepo shared package analysis")
  .description(
    "analyze the project (options: --tree, --json, --package, --deps, --shared)",
  )
  .action((target, options) => {
    validateOptions(options, "analyze");

    analyze(target, options);
  });

program.parse();
