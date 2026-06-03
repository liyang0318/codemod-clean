const chalk = require("chalk");
const {
  MUTUALLY_EXCLUSIVE,
  ANALYZE_MUTUALLY_EXCLUSIVE,
} = require("../constants/index.js");
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
  getRelativePath,
  formatDate,
  formatBytes,
};
