const { parseStyle: parseStylePostcss } = require("../../utils/parse.js");
const { collectStyleClass } = require("../../utils/collectClass.js");

const REG = /v-bind\s*\(\s*['"]?([a-zA-Z_$][\w$]*)['"]?\s*\)/g;

function parseStyle(styles) {
  const styleModule = {
    type: "style",
    blocks: [],
    bindings: new Set(),
    classes: new Set(),
  };

  if (!styles?.length) return styleModule;

  for (const style of styles) {
    const classes = new Set();

    const { content, lang } = style;

    const root = parseStylePostcss(content, lang);

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
