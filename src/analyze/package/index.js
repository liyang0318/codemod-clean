const path = require("path");
const renderDependenciesGraph = require("./render/dependency.js");
const renderPackages = require("./render/packages.js");
const renderSharedGraph = require("./render/shared.js");
const { detectWorkspace } = require("../utils/index.js");
const { handleErrorExit } = require("../../utils/index.js");

async function packageAnalyzer(targetPath, options = {}) {
  const rootPath = path.resolve(targetPath);

  const workspaces = detectWorkspace(rootPath);

  const { deps, shared } = options;

  if (deps || shared) {
    if (!workspaces.length) {
      handleErrorExit(
        "No workspaces found, please check your workspace configuration",
      );
    }
  }

  if (deps) {
    await renderDependenciesGraph(rootPath, workspaces, options);
  } else if (shared) {
    await renderSharedGraph(rootPath, workspaces, options);
  } else {
    await renderPackages(rootPath, workspaces, options);
  }
}

module.exports = packageAnalyzer;
