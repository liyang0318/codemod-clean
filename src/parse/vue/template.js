const compiler = require("@vue/compiler-dom");
const { extractExpression, extractVFor } = require("../../utils/index.js");

const references = new Set();

function parseTemplate(template) {
  if (!template) return blocks;

  const templateAst = compiler.parse(template.content);

  findVariable(templateAst);

  return {
    type: "template",
    content: template.content,
    ast: templateAst,
    references,
  };
}

function findVariable(node) {
  if (!node) return [];

  // 插值 {{ num }}
  if (node.type === 5) {
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

  if (node.children?.length) {
    node.children.forEach(findVariable);
  }
}

module.exports = parseTemplate;
