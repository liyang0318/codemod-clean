const chalk = require("chalk");
const { MUTUALLY_EXCLUSIVE } = require("../constants/index.js");

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
 */
function validateOptions(options) {
  for (const group of MUTUALLY_EXCLUSIVE) {
    const actives = group.filter((key) => options[key]);

    if (actives.length > 1) {
      handleErrorExit(`--${actives.join(" and --")} cannot be used together`);
    }
  }
}

module.exports = {
  handleErrorExit,
  validateOptions,
};
