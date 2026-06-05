const parser = require("@babel/parser");
const postcss = require("postcss");
const scss = require("postcss-scss");
const less = require("postcss-less");

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

function parseStyle(content, lang = "scss") {
  switch (lang) {
    case "sass":
    case "scss":
      return scss.parse(content);
    case "less":
      return less.parse(content);
    case "css":
    default:
      return postcss.parse(content);
  }
}

module.exports = {
  parse,
  parseExpression,
  parseStyle,
};
