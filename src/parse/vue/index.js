const { parse: parseSFC } = require("@vue/compiler-sfc");
const parseScript = require("./script.js");
const parseTemplate = require("./template.js");
const parseStyle = require("./style.js");

function parseVUE(content, file) {
  const { descriptor } = parseSFC(content);

  const { script, scriptSetup, template, styles } = descriptor;

  const templateModule = parseTemplate(template);
  const scriptModules = parseScript({ script, scriptSetup });
  const styleModule = parseStyle(styles);

  const references = templateModule?.references;

  const bindings = styleModule?.bindings;

  const usedVariables = new Set([...bindings, ...references]);

  const styleClasses = styleModule?.classes;
  const templateClasses = templateModule?.classes;

  const blocks = [templateModule, ...scriptModules, styleModule];

  return {
    type: "vue",
    file,
    content,
    descriptor,
    usedVariables,
    styleClasses,
    templateClasses,
    blocks,
  };
}

module.exports = parseVUE;
