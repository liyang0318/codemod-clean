const compiler = require("@vue/compiler-dom");
const { extractExpression, extractVFor } = require("../utils/index.js");
const { collectTemplateClass } = require("@utils/collectClass.js");

const nodeTypes = compiler.NodeTypes;

function parseTemplate(template) {
  if (!template) return {};

  const references = new Set();
  const classes = new Set();

  const templateAst = compiler.parse(template.content);

  findVariable(templateAst, references, classes);

  return {
    type: "template",
    content: template.content,
    ast: templateAst,
    loc: template.loc,
    references,
    classes,
  };
}

function findVariable(node, references, classes) {
  if (!node) return [];

  // 插值 {{ num }}
  if (node.type === nodeTypes.INTERPOLATION) {
    const exp = node.content?.content;

    if (exp) {
      extractExpression(exp, references);
    }
  }

  // element props (v-if | v-bind | v-show | etc)
  if (node.props?.length) {
    for (const prop of node.props) {
      const exp = prop.exp?.content;
      if (exp) {
        extractExpression(exp, references);
      }

      // v-for special case
      if (prop.name === "for" && prop.exp?.content) {
        extractVFor(prop.exp.content, references);
      }
    }
  }

  // 收集 class 属性
  collectTemplateClass(node, classes);

  if (node.children?.length) {
    node.children.forEach((child) => findVariable(child, references, classes));
  }
}

module.exports = parseTemplate;
