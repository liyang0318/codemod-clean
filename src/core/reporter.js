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
    byType: {
      console: 0,
      unusedVar: 0,
      unusedImport: 0,
    },
  };

  #types = ["console", "unusedVar", "unusedImport"];
  #changesByFile = new Map();

  constructor(mode) {
    if (Reporter.instance) {
      return Reporter.instance;
    }

    Reporter.instance = this;

    this.mode = mode;
  }

  #updateStats(type) {
    this.#stats.totalRemovals++;

    const byType = this.#stats.byType;
    byType[type]++;
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
      console: "console 调用",
      var: "未使用变量",
      import: "未使用导入",
    };

    return labelMap[type] || type;
  }

  // 打印日志
  #log(message, level = 0) {
    console.log(`${"  ".repeat(level)}${message}`);
  }

  // 获取相对路径
  #getRelativePath(filePath) {
    return path.relative(process.cwd(), filePath);
  }

  // 按类型分组
  #groupByType(changes) {
    const grouped = {};

    this.#types.forEach((type) => {
      for (const change of changes) {
        if (change.type === type) {
          grouped[type] = grouped[type] || [];
          grouped[type].push(change);
        }
      }
    });

    return grouped;
  }
  // 获取消息
  #getMessage(type, node) {
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

    return messageMap[type]?.() || type;
  }

  // 收集删除记录
  collect(type, node, options = {}) {
    const change = {
      type,
      action: this.mode === "fix" ? "removed" : "will remove",
      message: this.#getMessage(type, node),
      code: generate(node).code,
      line: node.loc.start.line,
    };

    if (!this.#changesByFile.has(options.file)) {
      this.#changesByFile.set(options.file, []);
    }

    this.#changesByFile.get(options.file).push(change);

    // 更新统计
    this.#updateStats(type);

    return change;
  }

  // 打印记录
  printSummary() {
    console.log(chalk.blue(`\n✅ 处理完成:`));

    console.log(chalk.white(`📃 处理文件数: ${this.#stats.filesProcessed}`));
    console.log(chalk.white(`📝 修改文件数: ${this.#stats.filesModified}`));
    console.log(chalk.white(`📉 总计: ${this.#stats.totalRemovals}`));

    this.#types.forEach((type) => {
      this.#log(
        chalk.gray(`- ${this.#getLabel(type)}: ${this.#stats.byType[type]}`),
      );
    });
  }

  // 详细报告
  printDetailedReport() {
    if (this.#changesByFile.size === 0) {
      console.log(chalk.yellow("\n📝 没有发现需要修改的代码"));
      return;
    }

    console.log(chalk.blue("\n📝 详细修改报告（按文件分类）:\n"));

    let fileIndex = 0;

    for (const [file, changes] of this.#changesByFile) {
      fileIndex++;

      const relativePath = this.#getRelativePath(file);

      this.#log(chalk.cyan(chalk.bold(`${fileIndex}.📝 ${relativePath}`)));

      const grouped = this.#groupByType(changes);

      for (const type in grouped) {
        const changesByType = grouped[type];

        if (changesByType.length === 0) continue;

        this.#log(
          chalk.white(`${this.#getLabel(type)} (${changesByType.length}):`),
          1,
        );

        changesByType.forEach((change, index) => {
          this.#log(
            `${chalk.gray(`${index + 1}.`)}${chalk.white(change.message)}`,
            2,
          );
          this.#log(chalk.dim(`代码: ${change.code}`), 2);
          this.#log(chalk.yellow(`位置: 第 ${change.line} 行`), 2);
        });
      }
    }
  }

  printReport() {
    this.printSummary();
    this.printDetailedReport();
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
      byType: {
        console: 0,
        unusedVar: 0,
        unusedImport: 0,
      },
    };
  }
}

module.exports = Reporter;
