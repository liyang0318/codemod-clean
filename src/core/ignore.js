const fsExtra = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const builtinIgnores = [
  "node_modules",
  "dist",
  ".DS_Store",
  ".git",
  ".vscode",
  ".cache",
];

class Ignore {
  constructor(root) {
    this.root = root;

    this.gitIgnorePath = path.join(root, ".gitignore");

    this.isHasGitignore = fsExtra.existsSync(this.gitIgnorePath);
  }

  /**
   * 获取忽略规则
   * @returns {string[]}
   */
  getIgnorePatterns() {
    const patterns = [...builtinIgnores];
    if (this.isHasGitignore) {
      const content = fsExtra.readFileSync(this.gitIgnorePath, "utf-8");

      patterns.push(
        ...content
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith("#")),
      );
    }

    const ignorePatterns = patterns.flatMap((dir) => [
      dir,
      `${dir}/**`,
      `**/${dir}/**`,
    ]);

    return ignorePatterns;
  }

  /**
   * 打印忽略规则信息
   */
  printIgnoreInfo() {
    console.log(chalk.cyan("ℹ ignore:"));
    console.log(
      `${chalk.white("- builtin:")} ${chalk.dim(builtinIgnores.join(", "))}`,
    );
    console.log(
      `${chalk.white("- gitignore:")} ${this.isHasGitignore ? chalk.green("enabled") : chalk.red("unenabled")}`,
    );
    console.log(
      `${chalk.white("- gitignore path:")} ${this.isHasGitignore ? chalk.dim(this.gitIgnorePath) : chalk.red("not found")}\n`,
    );
  }
}

module.exports = Ignore;
