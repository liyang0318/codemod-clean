const parser = require("@babel/parser");
function parse(content) {
  console.log("start");

  const aa = console.log(123);

  parser.parse(content, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
}

console.info("info");
module.exports = parse;
