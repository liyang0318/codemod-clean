const generate = require("@babel/generator").default;

function generateJS(ctx) {
  return generate(ctx.ast, { comments: true, retainLines: true }).code;
}

module.exports = generateJS;
