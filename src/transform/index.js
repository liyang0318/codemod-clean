const runRules = require("../rules/runRules.js");

function transform(ctx) {
  // vue
  switch (ctx.type) {
    case "vue":
      for (const block of ctx.blocks) {
        runRules(block.ast, ctx);
      }
      break;
    default:
      runRules(ctx.ast, ctx);
      break;
  }
}

module.exports = transform;
