function createBlock(block, code) {
  const attrsStr = Object.entries(block.attrs || {}).map(([key, val]) => {
    if (val === true) {
      return key;
    }

    return `${key}="${val}"`;
  });

  const tag = "script";

  return `<${tag} ${attrsStr.join(" ")}>${code}</${tag}>`;
}

module.exports = createBlock;
