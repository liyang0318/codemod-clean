const generateVUE = require("./vue/index.js");
const generateJS = require("./generateJS.js");

/**
 * 生成器 - 根据文件类型生成代码
 * @param {compiler.Context} ctx - 编译上下文
 * @returns {string} - 生成的代码
 */
function generator(ctx) {
  switch (ctx.type) {
    case "vue":
      return generateVUE(ctx);
    default:
      return generateJS(ctx);
  }
}

module.exports = generator;
