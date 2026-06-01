const treeify = require("treeify");
const { getStat } = require("./utils/index.js");

function toTree(files) {
  const fileTree = {};

  for (const file of files) {
    const parts = file.split("/");

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
