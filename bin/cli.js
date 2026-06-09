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
  .option("--dry", "scan and report issues without modifying files (default)")
  .option("--fix", "apply safe code cleanup fixes")
  .option("--stylish", "output a human-readable report (default)")
  .option("--json", "output cleanup report as JSON")
  .description(
    "scan JavaScript, TypeScript, and Vue files for cleanup opportunities",
  )
  .action((target, options) => {
    validateOptions(options, "run");

    run(target, options);
  });

program
  .command("analyze")
  .argument("[target]")
  .option("--tree", "output project tree structure (default)")
  .option("--json", "output project analysis as JSON")
  .option("--structure", "analyze project file structure (default)")
  .option("--package", "analyze workspace packages")
  .option("--deps", "analyze workspace dependency graph")
  .option(
    "--shared [package...]",
    "analyze shared workspace packages; optionally filter by package name",
  )
  .description(
    "analyze project structure, packages, workspace dependencies, and shared package usage",
  )
  .action((target, options) => {
    validateOptions(options, "analyze");

    analyze(target, options);
  });

program.parse();
