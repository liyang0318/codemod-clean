const toTree = require("./toTree.js");
const toJson = require("./toJson.js");
const { globAllPackages, formatPackageTree } = require("../../utils/index.js");

async function renderPackages(rootPath, workspaces, options = {}) {
  const files = await globAllPackages(rootPath, workspaces);

  const tree = await formatPackageTree(files, rootPath);

  if (options.json) {
    toJson(tree);
  } else {
    toTree(tree);
  }
}

module.exports = renderPackages;
