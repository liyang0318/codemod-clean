const parser = require("@babel/parser");

function parse(content) {
  return parser.parse(content, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx", "decorators-legacy"],
    errorRecovery: true,
  });
}

module.exports = parse;
