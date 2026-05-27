const generate = require("@babel/generator").default;
const chalk = require("chalk");
const path = require("path");

/**
 * 报告器 - 收集删除记录并打印统计信息
 */
class Reporter {
  #stats = {
    filesProcessed: 0, // 处理的文件数
    filesModified: 0, // 修改的文件数
    totalRemovals: 0, // 总删除数
    byRule: {
      console: 0,
      unusedVar: 0,
      unusedImport: 0,
    },
  };

  #rules = ["console", "unusedVar", "unusedImport"];
  #changesByFile = new Map();

  constructor(mode) {
    if (Reporter.instance) {
      return Reporter.instance;
    }

    Reporter.instance = this;

    this.mode = mode;
  }

  #updateStats(rule) {
    this.#stats.totalRemovals++;

    const byRule = this.#stats.byRule;
    byRule[rule]++;
  }

  // 更新处理的文件数
  updateFilesProcessed(processed) {
    this.#stats.filesProcessed += processed;
  }

  // 更新修改的文件数
  updateFileModifiedStats(modified) {
    this.#stats.filesModified += modified;
  }

  #getLabel(type) {
    const labelMap = {
      console: "console",
      var: "未使用变量",
      import: "未使用导入",
    };

    return labelMap[type] || type;
  }

  // 打印日志
  #log(message, level = 0) {
    console.log(`${"  ".repeat(level)}${message}`);
  }

  #printHeader(title) {
    this.#log(chalk.green(`\n${title}`));
    this.#log("-".repeat(30));
  }

  // 获取相对路径
  #getRelativePath(filePath) {
    return path.relative(process.cwd(), filePath);
  }

  // 按规则分组
  #groupByRule(changes) {
    const grouped = {};

    this.#rules.forEach((rule) => {
      for (const change of changes) {
        if (change.rule === rule) {
          grouped[rule] = grouped[rule] || [];
          grouped[rule].push(change);
        }
      }
    });

    return grouped;
  }
  // 获取消息
  #getMessage(rule, node) {
    const messageMap = {
      console: () => {
        const methodName = node.callee.property.name;
        return `console.${methodName}() 调用`;
      },
      unusedVar: () => {
        return `未使用变量 ${node.id.name}`;
      },
      unusedImport: () => {
        return `未使用导入 ${node.source.value}`;
      },
    };

    return messageMap[rule]?.() || rule;
  }

  // 收集删除记录
  collect(rule, node, options = {}) {
    const change = {
      rule,
      action: this.mode === "fix" ? "removed" : "remove",
      message: this.#getMessage(rule, node),
      code: generate(node).code,
      line: node.loc.start.line,
    };

    if (!this.#changesByFile.has(options.file)) {
      this.#changesByFile.set(options.file, []);
    }

    this.#changesByFile.get(options.file).push(change);

    // 更新统计
    this.#updateStats(rule);

    return change;
  }

  // 打印记录
  printSummary() {
    this.#log("\n✅ 处理完成");

    this.#printHeader("📁 文件统计");

    console.log(chalk.white(`处理文件数: ${this.#stats.filesProcessed}`));
    console.log(chalk.white(`修改文件数: ${this.#stats.filesModified}`));
    console.log(chalk.white(`问题总数  : ${this.#stats.totalRemovals}`));

    this.#printHeader("📊 Rule 统计");

    this.#rules.forEach((rule) => {
      this.#log(
        chalk.white(`${this.#getLabel(rule)}: ${this.#stats.byRule[rule]}`),
      );
    });
  }

  // 详细报告
  printDetailedReport() {
    if (this.#changesByFile.size === 0) {
      console.log(chalk.yellow("\n📝 没有发现需要修改的代码"));
      return;
    }

    console.log(chalk.blue("\n📝 详细修改报告（按文件分类）"));
    this.#log("═".repeat(50));

    let fileIndex = 0;

    for (const [file, changes] of this.#changesByFile) {
      fileIndex++;

      const relativePath = this.#getRelativePath(file);

      this.#log(chalk.cyan(chalk.bold(`\n${fileIndex}.📄 ${relativePath}`)));
      this.#log("-".repeat(30));

      const grouped = this.#groupByRule(changes);

      for (const rule in grouped) {
        const changesByRule = grouped[rule];

        if (changesByRule.length === 0) continue;

        this.#log(
          chalk.white(`${this.#getLabel(rule)} (${changesByRule.length}):`),
          1,
        );

        changesByRule.forEach((change, index) => {
          this.#log(
            `${chalk.dim(`${index + 1}.`)}${chalk.white(change.message)}`,
            2,
          );
          this.#log(chalk.dim(`• 代码: ${change.code}`), 2);
          this.#log(chalk.yellow(`• 位置: 第 ${change.line} 行`), 2);
        });
      }
    }
  }

  printAllReport() {
    this.printSummary();
    this.printDetailedReport();
  }

  // --json 输出
  printJsonReport() {
    const summary = {
      filesProcessed: this.#stats.filesProcessed,
      filesModified: this.#stats.filesModified,
      totalRemovals: this.#stats.totalRemovals,
    };

    const rules = Object.fromEntries(
      Object.entries(this.#stats.byRule).map(([rule, count]) => [
        this.#getLabel(rule),
        count,
      ]),
    );

    const files = [];

    if (this.#changesByFile.size > 0) {
      for (const [file, changes] of this.#changesByFile) {
        files.push({
          file: this.#getRelativePath(file),
          issues: changes.map((change) => ({
            rule: this.#getLabel(change.rule),
            action: change.action,
            message: change.message,
            code: change.code,
            line: change.line,
          })),
        });
      }
    }

    const result = {
      summary,
      rules,
      files,
    };

    console.log(JSON.stringify(result, null, 2));

    return result;
  }

  getStats() {
    return { ...this.#stats };
  }

  reset() {
    this.#changesByFile = new Map();

    this.#stats = {
      filesProcessed: 0,
      filesModified: 0,
      totalRemovals: 0,
      byRule: {
        console: 0,
        unusedVar: 0,
        unusedImport: 0,
      },
    };
  }
}

module.exports = Reporter;
