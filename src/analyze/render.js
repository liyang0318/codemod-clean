const toJson = require("./toJson.js");
const toTree = require("./toTree.js");

function render(files, options = {}) {
  if (options.json) {
    toJson(files);
  } else {
    toTree(files);
  }
}

module.exports = render;
