const scan = require("@core/scanner.js");
const { getRelativePath } = require("@utils/index.js");
const renderStructure = require("@/analyze/structure/render.js");
const Ignore = require("@core/ignore.js");
const packageAnalyzer = require("@/analyze/package/index.js");

async function analyze(target, options = {}) {
  const targetPath = target || ".";

  const ignore = new Ignore(targetPath);

  ignore.printIgnoreInfo();

  const files = await scan(targetPath, "all");

  const relativeFiles = files.map((file) => getRelativePath(file));

  const { package, deps, shared } = options;

  if (package || deps || shared) {
    await packageAnalyzer(targetPath, options);
  } else {
    renderStructure(relativeFiles, options);
  }
}

module.exports = analyze;
