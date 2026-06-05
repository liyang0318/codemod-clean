const toJson = require("./toJson.js");
const toTree = require("./toTree.js");
const scan = require("../../core/scanner.js");

async function renderStructure(targetPath, options = {}) {
  const files = await scan(targetPath, "all");

  if (options.json) {
    toJson(targetPath, files);
  } else {
    toTree(targetPath, files);
  }
}

module.exports = renderStructure;
