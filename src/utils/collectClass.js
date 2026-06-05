const compiler = require("@vue/compiler-dom");
const selectorParser = require("postcss-selector-parser");
const { parseExpression } = require("@utils/parse.js");

const nodeTypes = compiler.NodeTypes;

/**
 * 收集模板中的类名
 * @param {compiler.Node} node - 编译后的节点节点
 * @param {Set} classes - 类名集合
 */
function collectTemplateClass(node, classes) {
  if (node?.type !== nodeTypes.ELEMENT || !node?.props?.length) return;

  for (const prop of node.props) {
    if (prop.type === nodeTypes.ATTRIBUTE && prop.name === "class") {
      const content = prop.value.content?.split(/\s+/);

      if (content?.length) {
        content.forEach((item) => {
          classes.add(item);
        });
      }
    } else if (
      prop.type === nodeTypes.DIRECTIVE &&
      prop.name === "bind" &&
      prop?.arg?.content === "class"
    ) {
      const content = prop.exp.content;

      extractExpression(content, classes);
    }
  }
}

/**
 * 收集样式中的类名
 * @param {string} ast - 样式 AST
 * @param {Set} classes - 类名集合
 */
function collectStyleClass(ast, classes) {
  if (!ast) return;

  ast.walkRules((rule) => {
    const selector = rule.selector;
    const classNames = getClassNamesBySelector(selector);

    classNames?.length &&
      classes.add({
        classes: classNames,
        selector,
        line: rule.source?.start?.line,
        column: rule.source?.start?.column,
      });
  });
}

/**
 * 解析选择器中的类名
 * @param {string} selector - 选择器内容
 * @returns {Array} - 类名数组
 */
function getClassNamesBySelector(selector) {
  const classes = [];

  selectorParser((selectors) => {
    selectors.walkClasses((node) => {
      classes.push(node.value);
    });
  }).processSync(selector);

  return classes;
}

/**
 * 提取表达式中的类名
 * @param {string} content - 表达式内容
 * @param {Set} classes - 类名集合
 */
function extractExpression(content, classes) {
  const expAst = parseExpression(content);

  function walk(ast) {
    if (!ast) return;

    switch (ast.type) {
      case "StringLiteral":
        classes.add(ast.value);
        break;
      case "ArrayExpression":
        ast.elements.forEach(walk);
        break;
      case "ObjectExpression":
        ast.properties.forEach((item) => {
          walk(item.value);
          walk(item.key);
        });
        break;
      case "ConditionalExpression":
        walk(ast.test);
        walk(ast.consequent);
        walk(ast.alternate);
        break;
    }
  }

  walk(expAst);
}

module.exports = {
  collectTemplateClass,
  collectStyleClass,
  extractExpression,
  getClassNamesBySelector,
};
