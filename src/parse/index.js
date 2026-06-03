const path = require("path");
const parseJS = require("./parseJS.js");
const parseVUE = require("./vue/index.js");

function parse(content, file) {
  const ext = path.extname(file);

  switch (ext) {
    case ".vue":
      return parseVUE(content, file);
    case ".js":
    case ".ts":
      return parseJS(content, file);
  }
}

module.exports = parse;
