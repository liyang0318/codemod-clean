const treeify = require("treeify");

function toTree(tree) {
  console.log(treeify.asTree(tree, true));
}

module.exports = toTree;
