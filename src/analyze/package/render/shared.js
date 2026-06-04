const { indent } = require("@utils/index.js");
const chalk = require("chalk");
const {
  getWorkspacesDeps,
  globWorkspacesPackages,
  parsePackageJson,
} = require("@analyze/utils/index.js");

async function renderSharedGraph(rootPath, workspaces, options = {}) {
  const files = await globWorkspacesPackages(rootPath, workspaces);

  const workspacesSet = getWorkspacesDeps(files);

  const sharedPkgs = [];

  for (const workspace of workspacesSet) {
    const shared = {
      name: workspace,
      size: 0,
      pkgs: [],
    };

    files.forEach((file) => {
      const pkg = parsePackageJson(file);

      const { name, dependencies, devDependencies } = pkg;

      const deps = [
        ...Object.keys(dependencies || {}),
        ...Object.keys(devDependencies || {}),
      ];

      if (deps.includes(workspace)) {
        shared.pkgs.push(name);

        shared.size++;
      }
    });

    sharedPkgs.push(shared);
  }

  sharedPkgs.sort((a, b) => b.size - a.size);

  report(sharedPkgs);
}

function report(sharedPkgs) {
  sharedPkgs.forEach((shared) => {
    console.log(
      `\n${colorByUsage(shared.size)("●")} ${shared.name} (${shared.size})`,
    );

    if (shared.size) {
      console.log(`${indent(1)}used by:`);

      shared.pkgs.forEach((name) => {
        console.log(`${indent(2)}- ${chalk.cyan(name)}`);
      });
    } else {
      console.log(`${indent(1)}not used by any package`);
    }
  });
}

function colorByUsage(count) {
  if (count >= 5) return chalk.red.bold;
  if (count >= 3) return chalk.yellow.bold;
  if (count >= 1) return chalk.blue;

  return chalk.dim;
}

module.exports = renderSharedGraph;
