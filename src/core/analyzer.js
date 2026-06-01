const scan = require("@core/scanner.js");
const { getRelativePath } = require("@utils/index.js");
const render = require("@/analyze/render.js");
const Ignore = require("@core/ignore.js");

async function analyze(target, options = {}) {
  const targetPath = target || "./";

  const ignore = new Ignore(targetPath);

  ignore.printIgnoreInfo();

  const files = await scan(targetPath, "all");

  const relativeFiles = files.map((file) => getRelativePath(file));

  render(relativeFiles, options);
}

module.exports = analyze;
