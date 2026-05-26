const removeConsole = require("./console.js");
const removeUnusedImport = require("./unusedImport.js");
const removeUnusedVar = require("./unusedVar.js");

const rules = [removeConsole, removeUnusedImport, removeUnusedVar];

function runRules(ast, options = {}) {
  rules.forEach((rule) => rule(ast, options));
}

module.exports = runRules;
