const treeify = require("treeify");
const path = require("path");
const { getStat } = require("@analyze/utils/index.js");
const { getRelativePath } = require("@utils/index.js");

function toTree(targetPath, files) {
  const fileTree = {};

  for (const file of files) {
    const relativePath = getRelativePath(file, targetPath);

    const parts = relativePath.split(path.sep);

    if (!parts.length) continue;

    let current = fileTree;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      if (isLast) {
        const stat = getStat(file);

        current[part] = stat.isDirectory() ? {} : null;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  }

  const tree = getFileTreeDetail(fileTree);

  console.log(treeify.asTree(tree, true));

  return tree;
}

function getFileTreeDetail(tree) {
  const result = {};

  for (const [key, value] of Object.entries(tree)) {
    if (value && typeof value === "object") {
      result[`${key}/`] = getFileTreeDetail(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

module.exports = toTree;
