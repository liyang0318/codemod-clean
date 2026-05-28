const REG = /v-bind\s*\(\s*['"]?([a-zA-Z_$][\w$]*)['"]?\s*\)/g;

function parseStyle(styles) {
  const blocks = [];

  const bindings = new Set();

  if (!styles || !styles.length) return blocks;

  for (const style of styles) {
    let match;

    while ((match = REG.exec(style.content))) {
      bindings.add(match[1]);
    }

    blocks.push({
      type: "style",
      content: style.content,
      bindings,
    });
  }

  return blocks;
}

module.exports = parseStyle;
