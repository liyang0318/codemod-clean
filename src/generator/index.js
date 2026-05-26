const generateVUE = require("./generateVUE.js");
const generateJS = require("./generateJS.js");

function generator(ctx) {
  switch (ctx.type) {
    case "vue":
      return generateVUE(ctx);
    default:
      return generateJS(ctx);
  }
}

module.exports = generator;
