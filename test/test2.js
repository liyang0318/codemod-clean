const parser = require("@babel/parser");
function parse(content) {
  const aa = 1;
  parser.parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
}

console.log("end");
module.exports = parse;
