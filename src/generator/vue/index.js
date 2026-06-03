const generateTemplate = require("./template.js");
const generateScript = require("./script.js");
const generateStyle = require("./style.js");

/**
 * 生成 Vue 代码
 * @param {compiler.Context} ctx - 编译上下文
 * @returns {string} - Vue 代码字符串
 */
function generateVUE(ctx) {
  let output = "";

  // 提取 style
  const styleBlocks =
    ctx.blocks.find((block) => block.type === "style")?.blocks || [];

  const blocks = [
    ...ctx.blocks.filter((block) => block.type !== "style"),
    ...styleBlocks,
  ];

  // 按照 loc.start.offset 排序
  const orderedBlocks = blocks.sort(
    (a, b) => a.loc.start.offset - b.loc.start.offset,
  );

  for (const block of orderedBlocks) {
    switch (block.type) {
      case "template":
        const templateCode = generateTemplate(block);
        output += templateCode + "\n";
        break;
      case "script":
      case "scriptSetup":
        const scriptCode = generateScript(block);
        output += scriptCode + "\n";
        break;
      case "style":
        const styleCode = generateStyle(block);
        output += styleCode + "\n";
        break;
    }
  }

  return output;
}

module.exports = generateVUE;
