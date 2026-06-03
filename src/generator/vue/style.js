const { stringifyAttrs } = require("../utils/index.js");

/**
 * ast -> style 字符串
 * @param {compiler.Node} block - 编译后的节点节点
 * @returns {string} - Vue 样式字符串
 */
function generateStyle(block) {
  const attrs = stringifyAttrs(block.attrs);

  const code = block.ast.toString();

  return `<style ${attrs}>${code}</style>`;
}

module.exports = generateStyle;
