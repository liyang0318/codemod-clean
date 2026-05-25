const fsExtra = require("fs-extra");
const path = require("path");
const { globby } = require("globby");
const chalk = require("chalk");

async function scan(target) {
  const abs = path.resolve(target);

  if (!fsExtra.existsSync(abs)) {
    console.log(chalk.red("❌ 错误:"), chalk.white(`路径 "${target}" 不存在`));
    console.log(chalk.yellow("🔔 提示:"), chalk.gray("请检查路径是否正确"));

    process.exit(1);
  }

  const stat = fsExtra.statSync(abs);

  const exts = [".js", ".ts", ".vue"];

  // 文件
  if (stat.isFile()) {
    const ext = path.extname(abs);

    if (!exts.includes(ext)) {
      console.log(chalk.yellow(`⚠ 跳过不支持的文件类型: ${abs}`));
      return [];
    }

    return [abs];
  }

  return globby(["**/*.{js,ts,vue}"], {
    cwd: abs,
    absolute: true,
    ignore: ["**/node_modules/**", "**/dist/**"],
  });
}

module.exports = scan;
