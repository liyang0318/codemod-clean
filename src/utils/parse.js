const parser = require("@babel/parser");

function parse(content) {
  return parser.parse(content, {
    sourceType: "unambiguous",
    plugins: ["typescript", "jsx", "decorators-legacy"],
    errorRecovery: true,
  });
}

function parseExpression(content) {
  return parser.parseExpression(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
}

module.exports = {
  parse,
  parseExpression,
};
