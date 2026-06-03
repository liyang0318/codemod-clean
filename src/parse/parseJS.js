const parser = require("@babel/parser");
const path = require("path");

function parseJS(content, file) {
  const ext = path.extname(file);

  const ast = parser.parse(content, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx", "decorators-legacy"],
  });

  return {
    type: ext.slice(1) || "js",
    ast,
    content,
    file,
    modified: false,
  };
}

module.exports = parseJS;
