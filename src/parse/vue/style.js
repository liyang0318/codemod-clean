const postcss = require("postcss");
const { collectStyleClass } = require("@utils/collectClass.js");

const REG = /v-bind\s*\(\s*['"]?([a-zA-Z_$][\w$]*)['"]?\s*\)/g;

function parseStyle(styles) {
  const styleModule = {
    type: "style",
    blocks: [],
    bindings: new Set(),
    classes: new Set(),
  };

  if (!styles || !styles.length) return blocks;

  for (const style of styles) {
    const classes = new Set();

    const root = postcss.parse(style.content);

    collectStyleClass(root, classes);

    let match;

    while ((match = REG.exec(style.content))) {
      styleModule.bindings.add(match[1]);
    }

    styleModule.blocks.push({
      type: "style",
      ast: root,
      originCode: root.toString(),
      ...style,
      classes,
    });
  }

  // 获取总的class
  for (const block of styleModule.blocks) {
    for (const { classes } of block.classes) {
      classes.forEach((classItem) => {
        styleModule.classes.add(classItem);
      });
    }
  }

  return styleModule;
}

module.exports = parseStyle;
