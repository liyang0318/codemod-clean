const path = require("path");
const chalk = require("chalk");
const { getStat } = require("@analyze/utils/index.js");
const { formatDate, formatBytes, getRelativePath } = require("@utils/index.js");

function toJson(targetPath, files) {
  const fileTree = {};

  for (const file of files) {
    const relativePath = getRelativePath(file, targetPath);
    const parts = relativePath.split(path.sep);

    if (!parts.length) continue;

    let current = fileTree;

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;

      const currentPath = parts.slice(0, index + 1).join(path.sep);

      const currentAbsolutePath = path.resolve(targetPath, currentPath);

      if (current && current[MARKERS_KEY_MAP.type.markKey] === "directory") {
        if (isLast) {
          current[MARKERS_KEY_MAP.children.markKey].push(
            getBaseItem(currentAbsolutePath),
          );
        } else {
          const item = current[MARKERS_KEY_MAP.children.markKey].find(
            (item) => item[MARKERS_KEY_MAP.name.markKey] === part,
          );
          if (!item) {
            current[MARKERS_KEY_MAP.children.markKey].push(
              getBaseItem(currentAbsolutePath),
            );
          }

          current = item;
        }
      } else {
        current[part] = current[part] || getBaseItem(currentAbsolutePath);
        current = current[part];
      }
    });
  }

  outputJson(fileTree);
}

function outputJson(fileTree) {
  let jsonString = JSON.stringify(fileTree, null, 2);

  for (const key in MARKERS_KEY_MAP) {
    const current = MARKERS_KEY_MAP[key];

    const stringRegex = new RegExp(`"${current.markKey}": "([^"]*)"`, "g");

    if (current.markKey === MARKERS_KEY_MAP.children.markKey) {
      jsonString = jsonString.replaceAll(
        `"${current.markKey}"`,
        current.outputKey,
      );
    }

    jsonString = jsonString.replace(stringRegex, (_, v) => {
      const key = current.outputKey;

      return `${key}${chalk.cyan(":")} ${current.outputValue(v)}`;
    });
  }

  // 打印 JSON 字符串
  console.log(jsonString);
}

function getOutputKey(key) {
  return chalk.cyan(`"${key}"`);
}

function getOutputValue(v, color) {
  return chalk[color](`"${v}"`);
}

const MARKERS_KEY_MAP = {
  name: {
    markKey: "___NAME___",
    outputKey: getOutputKey("name"),
    outputValue: (v) => getOutputValue(v, "blue"),
  },
  type: {
    markKey: "___TYPE___",
    outputKey: getOutputKey("type"),
    outputValue: (v) => getOutputValue(v, "magenta"),
  },
  path: {
    markKey: "___PATH___",
    outputKey: getOutputKey("path"),
    outputValue: (v) => getOutputValue(v, "yellow"),
  },
  size: {
    markKey: "___SIZE___",
    outputKey: getOutputKey("size"),
    outputValue: (v) => getOutputValue(v, "red"),
  },
  updateTime: {
    markKey: "___UPDATE_TIME___",
    outputKey: getOutputKey("updateTime"),
    outputValue: (v) => getOutputValue(v, "dim"),
  },
  createTime: {
    markKey: "___CREATE_TIME___",
    outputKey: getOutputKey("createTime"),
    outputValue: (v) => getOutputValue(v, "dim"),
  },
  children: {
    markKey: "___CHILDREN___",
    outputKey: getOutputKey("children"),
  },
};

function getBaseItem(currentPath) {
  const stat = getStat(currentPath);
  const type = stat.isDirectory() ? "directory" : "file";
  const baseItem = {
    [MARKERS_KEY_MAP.name.markKey]: path.basename(currentPath),
    [MARKERS_KEY_MAP.type.markKey]: type,
    [MARKERS_KEY_MAP.path.markKey]: currentPath,
    [MARKERS_KEY_MAP.size.markKey]: formatBytes(stat.size),
    [MARKERS_KEY_MAP.updateTime.markKey]: formatDate(stat.mtime),
    [MARKERS_KEY_MAP.createTime.markKey]: formatDate(stat.birthtime),
  };

  type === "directory" && (baseItem[MARKERS_KEY_MAP.children.markKey] = []);

  return baseItem;
}

module.exports = toJson;
