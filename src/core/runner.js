const fsExtra = require("fs-extra");
const chalk = require("chalk");
const parse = require("../parse/index.js");
const transform = require("../transform/index.js");
const generator = require("../generator/index.js");
const Reporter = require("./reporter.js");
const scan = require("./scanner.js");

async function run(target, mode) {
  const files = await scan(target);

  if (!files?.length) {
    console.log(chalk.yellow("🔔 提示:"), chalk.dim("未发现可处理的文件"));
    process.exit(0);
  }

  const reporter = new Reporter(mode.fix ? "fix" : "dry");

  reporter.reset();

  let modifiedCount = 0;

  for (const file of files) {
    // 读取文件内容
    const content = fsExtra.readFileSync(file, "utf-8");

    // 解析文件内容 生成 AST
    const ctx = parse(content, file);

    // 执行规则 处理 AST
    transform(ctx);

    if (mode.fix && ctx.modified) {
      const output = generator(ctx);

      modifiedCount++;
      fsExtra.writeFileSync(file, output);
    }
  }

  reporter.updateFileModifiedStats(modifiedCount);
  reporter.updateFilesProcessed(files.length);

  reporter.printReport();
}

module.exports = run;
