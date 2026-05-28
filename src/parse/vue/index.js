const { parse: parseSFC } = require("@vue/compiler-sfc");
const parseScript = require("./script.js");
const parseTemplate = require("./template.js");
const parseStyle = require("./style.js");

function parseVUE(content, file) {
  const { descriptor } = parseSFC(content);

  const { script, scriptSetup, template, styles } = descriptor;

  const references = parseTemplate(template)?.references;

  const bindings =
    parseStyle(styles)?.reduce((pre, cur) => {
      return new Set([...pre, ...cur.bindings]);
    }, new Set()) ?? new Set();

  const usedVariables = new Set([...bindings, ...references]);

  const blocks = parseScript({ script, scriptSetup });

  return {
    type: "vue",
    file,
    content,
    descriptor,
    usedVariables,
    blocks,
  };
}

module.exports = parseVUE;
