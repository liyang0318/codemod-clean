const parser = require("@babel/parser");
function parse(content) {
  return parser.parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
}
module.exports = parse;
