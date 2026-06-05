const generate = require("@babel/generator").default;
const { parseExpression } = require("../../utils/parse.js");
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

module.exports = {
  transformBlock,
  extractExpression,
  extractVFor,
};
