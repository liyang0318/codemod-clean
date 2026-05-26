const parser = require("@babel/parser");

function parseJS(content, file) {
  const ast = parser.parse(content, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx", "decorators-legacy"],
  });

  return {
    type: "js",
    ast,
    content,
    file,
    modified: false,
  };
}

module.exports = parseJS;
