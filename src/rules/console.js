const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const Reporter = require("../core/reporter.js");

/**
 * 移除 console.log 等方法调用
 * @param {Block} block - 代码块
 * @param {Object} options - 信息对象
 * @returns {Block} - 代码块
 */
function removeConsole(block, options = {}) {
  const { methodsToRemove = ["log", "info"], isRemoveAll = false } = options;

  const reporter = new Reporter();

  traverse(block.ast, {
    CallExpression(path) {
      const callee = path.node.callee;

      // 检查是否是 console.xx
      if (!t.isMemberExpression(callee)) return;
      if (!t.isIdentifier(callee.object, { name: "console" })) return;

      // 获取方法名 xx
      const methodName = callee.property.name;

      if (!isRemoveAll && !methodsToRemove.includes(methodName)) return;

      // 判断是不是独立语句
      // console.log(xx) 整行删除
      // const res = console.log(xx) 不是独立语句 不删除
      if (path.parentPath.isExpressionStatement()) {
        reporter.collect("console", path.node, options);

        path.parentPath.remove();
        options.modified = true;
      }
    },
  });

  return block;
}

module.exports = removeConsole;
