#!/usr/bin/env node
const { Command } = require("commander");
const pkg = require("../package.json");
const run = require("../src/core/runner.js");

const program = new Command();

program.name("codemod-clean").version(pkg.version);

program
  .command("run")
  .argument("<target>")
  .option("--dry", "只预览不修改")
  .option("--fix", "自动修复")
  .description("clean the code")
  .action((target, options) => {
    run(target, options);
  });

program.parse();
