const runRules = require("../rules/runRules.js");

function transform(ctx) {
  switch (ctx.type) {
    case "vue":
      for (const block of ctx.blocks) {
        runRules(block, ctx);
      }
      break;
    case "js":
    case "ts":
      runRules(ctx, ctx);
      break;
  }
}

module.exports = transform;
