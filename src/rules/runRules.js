const removeConsole = require("./console.js");
const removeUnusedImport = require("./unusedImport.js");
const removeUnusedVar = require("./unusedVar.js");
const removeUnusedClass = require("./unusedClass.js");

const rules = {
  console: {
    types: ["script", "scriptSetup", "js", "ts"],
    run: (block, options) => removeConsole(block, options),
  },
  unusedImport: {
    types: ["script", "scriptSetup", "js", "ts"],
    run: (block, options) => removeUnusedImport(block, options),
  },
  unusedVar: {
    types: ["script", "scriptSetup", "js", "ts"],
    run: (block, options) => removeUnusedVar(block, options),
  },
  unusedClass: {
    types: ["style"],
    run: (block, options) => removeUnusedClass(block, options),
  },
};

function runRules(block, ctx) {
  for (const key in rules) {
    const rule = rules[key];

    if (rule.types.includes(block.type)) {
      rule.run(block, ctx);
    }
  }
}

module.exports = runRules;
