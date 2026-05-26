const path = require("path");
const parseJS = require("./parseJS.js");
const parseVUE = require("./parseVUE.js");

function parse(content, file) {
  const ext = path.extname(file);

  switch (ext) {
    case ".vue":
      return parseVUE(content, file);
    default:
      return parseJS(content, file);
  }
}

module.exports = parse;
