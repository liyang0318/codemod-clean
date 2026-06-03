const generate = require("@babel/generator").default;
const { stringifyAttrs } = require("../utils/index.js");

/**
 * ast -> script 字符串
 * @param {compiler.Node} block - 编译后的节点节点
 * @returns {string} - Vue 脚本字符串
 */
function generateScript(block) {
  const code = generate(block.ast, {
    comments: true,
    retainLines: true,
  }).code;

  return `<script ${stringifyAttrs(block.attrs)}>\n${code}\n</script>`;
}

module.exports = generateScript;
