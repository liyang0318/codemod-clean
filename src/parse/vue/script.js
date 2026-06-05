const { transformBlock } = require("../utils/index.js");
const { parse } = require("../../utils/parse.js");

function parseScript({ script, scriptSetup }) {
  const blocks = [];

  // script
  if (script) {
    blocks.push(transformBlock(script, parse(script.content), "script"));
  }

  // script setup
  if (scriptSetup) {
    blocks.push(
      transformBlock(scriptSetup, parse(scriptSetup.content), "scriptSetup"),
    );
  }

  return blocks;
}

module.exports = parseScript;
