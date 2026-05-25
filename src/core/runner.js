const fsExtra = require("fs-extra");
const chalk = require("chalk");
const generate = require("@babel/generator").default;
const parse = require("../utils/parse.js");
const removeConsole = require("../rules/console.js");
const removeUnusedVar = require("../rules/unusedVar.js");
const removeUnusedImport = require("../rules/unusedImport.js");
const Reporter = require("./reporter.js");
const scan = require("./scanner.js");

async function run(target, mode) {
  const files = await scan(target);

  if (!files?.length) {
    console.log(chalk.yellow("🔔 提示:"), chalk.gray("未发现可处理的文件"));
    process.exit(0);
  }

  const reporter = new Reporter(mode.fix ? "fix" : "dry");

  reporter.reset();

  let modifiedCount = 0;

  for (const file of files) {
    // 读取文件内容
    const content = fsExtra.readFileSync(file, "utf-8");

    const ast = parse(content);

    const options = {
      file,
    };

    // 执行规则
    removeConsole(ast, options);
    removeUnusedVar(ast, options);
    removeUnusedImport(ast, options);

    if (mode.fix) {
      const output = generate(ast, {}).code;

      if (output !== content) {
        modifiedCount++;
        fsExtra.writeFileSync(file, output);
      }
    }
  }

  reporter.updateFileModifiedStats(modifiedCount);
  reporter.updateFilesProcessed(files.length);

  reporter.printReport();
}

module.exports = run;
