const toTree = require("./toTree.js");
const toJson = require("./toJson.js");
const {
  globWorkspacesPackages,
  formatDependencyTree,
} = require("../../utils/index.js");

async function renderDependenciesGraph(rootPath, workspaces, options = {}) {
  const files = await globWorkspacesPackages(rootPath, workspaces);

  const tree = await formatDependencyTree(files, rootPath);

  if (options.json) {
    toJson(tree);
  } else {
    toTree(tree);
  }
}

module.exports = renderDependenciesGraph;
