#!/usr/bin/env node
const { Command } = require("commander");
const pkg = require("../package.json");
const run = require("../src/core/runner.js");
const { validateOptions } = require("../src/utils/index.js");

const program = new Command();

program.name("codemod-clean").version(pkg.version);

program
  .command("run")
  .argument("<target>")
  .option("--dry", "preview without writing files (default)")
  .option("--fix", "apply changes to files")
  .option("--stylish", "output human-readable format (default)")
  .option("--json", "output JSON format")
  .description("clean the code")
  .action((target, options) => {
    validateOptions(options);

    run(target, options);
  });

program.parse();
