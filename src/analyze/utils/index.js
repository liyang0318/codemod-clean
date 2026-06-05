const fsExtra = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const { globby } = require("globby");
const Ignore = require("../../core/ignore.js");
const { getRelativePath } = require("../../utils/index.js");

function getStat(file) {
  return fsExtra.statSync(path.resolve(file));
}

/**
 * 检测工作空间
 * @param {string} targetPath - 目标路径
 * @returns {Array<string>} 工作空间路径数组
 */
function detectWorkspace(targetPath) {
  const pkgPath = path.join(targetPath, "package.json");

  const isHasPackageJson = fsExtra.existsSync(pkgPath);

  if (!isHasPackageJson) {
    console.log(chalk.red("no package.json found"));
    process.exit(0);
  }

  const pkg = parsePackageJson(pkgPath);

  const workspaces = pkg.workspaces || [];

  return workspaces;
}

async function globAllPackages(rootPath, workspaces) {
  const pkgPath = path.join(rootPath, "package.json");

  const workspacesPaths = await globWorkspacesPackages(rootPath, workspaces);

  return [pkgPath, ...workspacesPaths];
}

/**
 * 递归获取所有工作空间的 package.json 文件
 * @param {string} rootPath - 根路径
 * @param {Array<string>} workspaces - 工作空间路径数组
 * @returns {Promise<Array<string>>} 所有 package.json 文件路径数组
 */
async function globWorkspacesPackages(rootPath, workspaces) {
  if (!workspaces?.length) return [];

  const ignore = new Ignore(rootPath);

  const files = await globby(
    workspaces.map((workspace) => path.join(workspace, "package.json")),
    {
      cwd: rootPath,
      absolute: true,
      onlyFiles: true,
      ignore: ignore.getIgnorePatterns(),
    },
  );

  return files;
}

/**
 * 读取 package.json 文件
 * @param {string} file - package.json 文件路径
 * @returns {Object} package.json 文件内容
 */
function parsePackageJson(filePath) {
  try {
    const content = fsExtra.readFileSync(filePath, "utf-8");

    const pkg = JSON.parse(content);

    return pkg;
  } catch (error) {
    console.log(chalk.red(`read ${filePath} failed`));
  }
}

function formatPackageTree(filePaths, rootPath) {
  const tree = {};

  function getPkgData(filePath) {
    const pkg = parsePackageJson(filePath);

    return {
      name: pkg.name,
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
    };
  }

  for (const filePath of filePaths) {
    const relativePath = getRelativePath(filePath, rootPath);

    const parts = relativePath.split(path.sep);

    let current = tree;

    parts.forEach((part, index) => {
      if (!current[part]) {
        const isLast = index === parts.length - 1;

        current[part] = isLast ? getPkgData(filePath) : {};
      }

      current = current[part];
    });
  }

  return tree;
}

function getWorkspacesDeps(filePaths) {
  const workspaces = new Set();

  for (const filePath of filePaths) {
    const { name } = parsePackageJson(filePath);

    if (name) workspaces.add(name);
  }

  return workspaces;
}

function formatDependencyTree(filePaths, rootPath) {
  const tree = {};

  const workspaces = getWorkspacesDeps(filePaths);

  function getPkgData(filePath) {
    const pkg = parsePackageJson(filePath);

    const { name, dependencies, devDependencies } = pkg;

    const result = {};

    const deps = { dependencies, devDependencies };

    for (const [key, value] of Object.entries(deps)) {
      for (const dep in value) {
        if (workspaces.has(dep)) {
          if (!result[key]) result[key] = {};
          result[key][dep] = {};
        }
      }
    }

    return {
      name,
      result,
    };
  }

  for (const filePath of filePaths) {
    const relativePath = getRelativePath(filePath, rootPath);

    const parts = relativePath.split(path.sep);

    if (!parts.length) continue;

    let current = tree;

    for (let i = 0; i < parts.length; i++) {
      const len = parts.length;
      const part = parts[i];

      const isLastSecond = len === 1 ? true : i === len - 2;

      if (isLastSecond) {
        const { name, result } = getPkgData(filePath);

        const key = `${part} [${name}]`;

        current[key] = result;

        break;
      } else {
        if (!current[part]) current[part] = {};

        current = current[part];
      }
    }
  }

  return tree;
}

module.exports = {
  getStat,
  detectWorkspace,
  globAllPackages,
  globWorkspacesPackages,
  parsePackageJson,
  formatPackageTree,
  formatDependencyTree,
  getWorkspacesDeps,
};
