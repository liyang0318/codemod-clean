const generate = require("@babel/generator").default;
const chalk = require("chalk");
const path = require("path");

/**
 * 报告器 - 收集删除记录并打印统计信息
 */
class Reporter {
  constructor(mode) {
    if (Reporter.instance) {
      Reporter.instance.mode = mode;

      return Reporter.instance;
    }

    Reporter.instance = this;

    this.mode = mode;
  }

  #stats = {
    filesProcessed: 0, // 处理的文件数
    filesModified: 0, // 修改的文件数
    totalRemovals: 0, // 总删除数
    byRule: {
      console: 0,
      unusedVar: 0,
      unusedImport: 0,
      unusedClass: 0,
    },
  };

  #rules = ["console", "unusedVar", "unusedImport", "unusedClass"];
  #changesByFile = new Map();

  #updateStats(rule) {
    this.#stats.totalRemovals++;

    const byRule = this.#stats.byRule;
    byRule[rule]++;
  }

  #getLabel(rule) {
    const labelMap = {
      console: "console",
      unusedVar: "unused var",
      unusedImport: "unused import",
      unusedClass: "unused class",
    };

    return labelMap[rule] || rule;
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
        return `console.${methodName}() called`;
      },
      unusedVar: () => {
        return `unused var ${node.id.name}`;
      },
      unusedImport: () => {
        return `unused import ${node.source.value}`;
      },
      unusedClass: () => {
        return `unused class ${node.selector}`;
      },
    };

    return messageMap[rule]?.() || rule;
  }

  #formatNodeIno(rule, node) {
    const info = {
      message: this.#getMessage(rule, node),
      code: "",
      line: 0,
    };

    if (rule === "unusedClass") {
      info.code = node.toString();
      info.line = node.source?.start?.line;
    } else {
      info.code = generate(node).code;
      info.line = node.loc.start.line;
    }

    return info;
  }

  // 收集删除记录
  collect(rule, node, options = {}) {
    const { message, code, line } = this.#formatNodeIno(rule, node);
    const change = {
      rule,
      action: this.mode === "fix" ? "removed" : "remove",
      message,
      code,
      line,
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
    this.#log("\n✅ processed");

    this.#printHeader("📁 file statistics");

    console.log(chalk.white(`processed files: ${this.#stats.filesProcessed}`));
    console.log(chalk.white(`modified files : ${this.#stats.filesModified}`));
    console.log(chalk.white(`total removals : ${this.#stats.totalRemovals}`));

    this.#printHeader("📊 rule statistics");

    this.#rules.forEach((rule) => {
      this.#log(
        chalk.white(`${this.#getLabel(rule)}: ${this.#stats.byRule[rule]}`),
      );
    });
  }

  // 详细报告
  printDetailedReport() {
    if (this.#changesByFile.size === 0) {
      console.log(chalk.yellow("\n📝 no code to remove"));
      return;
    }

    console.log(chalk.blue("\n📝 detailed report by file"));
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
          chalk.white(`- ${this.#getLabel(rule)} (${changesByRule.length}):`),
          1,
        );

        changesByRule.forEach((change, index) => {
          this.#log(
            `${chalk.dim(`${index + 1}.`)}${chalk.white(change.message)}`,
            2,
          );
          this.#log(chalk.dim(`• code: ${change.code}`), 2);
          this.#log(chalk.yellow(`• location: line ${change.line} `), 2);
        });
      }
    }
  }

  // 打印所有报告 --stylish 输出
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

  // 获取统计信息
  getStats() {
    return { ...this.#stats };
  }

  // 更新处理的文件数
  updateFilesProcessed(processed) {
    this.#stats.filesProcessed += processed;
  }

  // 更新修改的文件数
  updateFileModifiedStats(modified) {
    this.#stats.filesModified += modified;
  }

  // 重置统计信息
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
        unusedClass: 0,
      },
    };
  }
}

module.exports = Reporter;
