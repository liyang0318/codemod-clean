const chalk = require("chalk");
const {
  MUTUALLY_EXCLUSIVE,
  ANALYZE_MUTUALLY_EXCLUSIVE,
} = require("../constants/index.js");
const generate = require("@babel/generator").default;
const { parseExpression } = require("./parse.js");
const path = require("path");
const dayjs = require("dayjs");

/**
 * 处理错误并退出程序
 * @param {string} message
 */
function handleErrorExit(message) {
  console.log(chalk.red(message));
  process.exit(1);
}

/**
 * 验证选项是否互斥
 * @param {Object} options
 * @param {string} type
 */
function validateOptions(options, type = "run") {
  const mutuallyExclusive = {
    run: MUTUALLY_EXCLUSIVE,
    analyze: ANALYZE_MUTUALLY_EXCLUSIVE,
  };
  for (const group of mutuallyExclusive[type]) {
    const actives = group.filter((key) => options[key]);

    if (actives.length > 1) {
      handleErrorExit(`--${actives.join(" and --")} cannot be used together`);
    }
  }
}

/**
 * 将 AST 转换为 统一 block 对象格式
 * @param {Object} block
 * @param {Object} ast
 * @param {string} type
 */
function transformBlock(block, ast, type) {
  return {
    type,
    ast,
    content: block.content,
    originCode: generate(ast, {
      comments: true,
      retainLines: true,
    }).code,
    loc: block.loc,
    attrs: block.attrs,
    modified: false,
  };
}

/**
 * 提取表达式中的变量
 * @param {string} content
 * @param {Set} references
 */
function extractExpression(content, references) {
  const ast = parseExpression(content);

  function walk(node) {
    if (!node) return;

    switch (node.type) {
      // 变量名
      case "Identifier":
        references.add(node.name);
        break;

      // 对象访问 a.b.c
      case "MemberExpression":
        walk(node.object);
        break;

      // 二次运算 a + b
      case "BinaryExpression":
      // 逻辑运算 a && b
      case "LogicalExpression":
        walk(node.left);
        walk(node.right);
        break;

      // 函数调用 fn(a, b)
      case "CallExpression":
        walk(node.callee);
        node.arguments.forEach(walk);
        break;

      //  三元表达式 a ? b : c
      case "ConditionalExpression":
        walk(node.test);
        walk(node.consequent);
        walk(node.alternate);
        break;
    }
  }

  walk(ast);
}

/**
 * 提取 v-for 中的变量
 * @param {string} content
 * @param {Set} references
 */
function extractVFor(content, references) {
  // item in list
  const match = content.match(/in\s+(.+)$/);

  if (match) {
    references.add(match[1]);
  }
}

/**
 * 获取文件路径的相对路径
 * @param {string} filePath
 */
function getRelativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

/**
 * 格式化日期
 * @param {Date} date
 * @param {string} format
 */
function formatDate(date, format) {
  const defaultFormat = "YYYY-MM-DD HH:mm:ss";

  return dayjs(date).format(format || defaultFormat);
}

/**
 * 格式化大小
 * @param {number} bytes
 * @param {number} decimals
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

module.exports = {
  handleErrorExit,
  validateOptions,
  transformBlock,
  extractExpression,
  extractVFor,
  getRelativePath,
  formatDate,
  formatBytes,
};
