const traverse = require("@babel/traverse").default;
const Reporter = require("../core/reporter.js");

/**
 * 移除未使用的变量
 * @param {Block} block - 代码块
 * @param {Object} options - 信息对象
 * @returns {Block} - 代码块
 */
function removeUnusedVar(block, options = {}) {
  const reporter = new Reporter();

  traverse(block.ast, {
    VariableDeclarator(path) {
      const name = path.node.id.name;
      const binding = path.scope.getBinding(name);

      if (
        binding &&
        !binding.referenced &&
        !isUsedTemplateOrStyle(name, options)
      ) {
        reporter.collect("unusedVar", path.node, options);
        path.remove();
        options.modified = true;
      }
    },
  });

  return block;
}

/**
 * vue 检查变量是否在模板或样式中被使用
 * @param {string} name - 变量名
 * @param {Object} options - 信息对象
 * @returns {boolean} - 是否被使用
 */
function isUsedTemplateOrStyle(name, options) {
  if (options.type !== "vue") return false;

  return options.usedVariables?.has(name);
}

module.exports = removeUnusedVar;
