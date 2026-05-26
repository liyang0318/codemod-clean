const { parse: parseSFC } = require("@vue/compiler-sfc");
const parse = require("../utils/parse.js");
const generate = require("@babel/generator").default;

function parseVUE(content, file) {
  const { descriptor } = parseSFC(content);

  const { script, scriptSetup } = descriptor;

  const blocks = [];

  // 普通 script
  if (script) {
    const block = descriptor.script;

    blocks.push(transformBlock(block, "script"));
  }

  // script setup
  if (scriptSetup) {
    const block = descriptor.scriptSetup;

    blocks.push(transformBlock(block, "scriptSetup"));
  }

  return {
    type: "vue",
    file,
    content,
    descriptor,
    blocks,
  };
}

function transformBlock(block, type) {
  return {
    type,
    ast: parse(block.content),
    content: block.content,
    originCode: generate(parse(block.content), {
      comments: true,
      retainLines: true,
    }).code,
    loc: block.loc,
    attrs: block.attrs,
    modified: false,
  };
}

module.exports = parseVUE;
