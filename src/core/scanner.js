const fsExtra = require("fs-extra");
const path = require("path");
const { globby } = require("globby");
const chalk = require("chalk");
const Ignore = require("@core/ignore.js");
const {
  SUPPORTED_EXTENSIONS,
  SUPPORTED_EXTENSIONS_PATTERN,
} = require("@constants/index.js");

function getIgnorePatterns(abs) {
  const ignore = new Ignore(abs);
  return ignore.getIgnorePatterns();
}

function scanFiles(abs, stat) {
  const ext = path.extname(abs);

  if (stat.isFile()) {
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      console.log(chalk.yellow(`⚠ 跳过不支持的文件类型: ${abs}`));
      return [];
    }
    return [abs];
  }

  return globby(SUPPORTED_EXTENSIONS_PATTERN, {
    cwd: abs,
    absolute: true,
    ignore: getIgnorePatterns(abs),
  });
}

function scanAll(abs, stat) {
  if (!stat.isDirectory()) {
    console.log(chalk.red("❌ 错误:"), chalk.white(`路径 "${abs}" 不是目录`));
    process.exit(1);
  }

  return globby(["**/*"], {
    cwd: abs,
    absolute: true,
    dot: true,
    onlyFiles: false,
    ignore: getIgnorePatterns(abs),
  });
}

async function scan(target, mode = "file") {
  const abs = path.resolve(target);

  if (!fsExtra.existsSync(abs)) {
    console.log(chalk.red("❌ 错误:"), chalk.white(`路径 "${target}" 不存在`));
    console.log(chalk.yellow("🔔 提示:"), chalk.dim("请检查路径是否正确"));
    process.exit(1);
  }

  const stat = fsExtra.statSync(abs);

  return mode === "all" ? scanAll(abs, stat) : scanFiles(abs, stat);
}

module.exports = scan;
