const generate = require("@babel/generator").default;

function generateVUE(ctx) {
  let output = ctx.content;

  const blocks = [...ctx.blocks].reverse();

  for (const block of blocks) {
    const code = generate(block.ast, {
      comments: true,
      retainLines: true,
    }).code;

    const start = block.loc.start.offset;
    const end = block.loc.end.offset;

    if (code !== block.originCode) {
      output = output.slice(0, start) + code + output.slice(end);
      ctx.modified = true;
    }
  }

  return output;
}

module.exports = generateVUE;
