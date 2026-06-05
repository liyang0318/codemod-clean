const renderStructure = require("@/analyze/structure/render.js");
const Ignore = require("@core/ignore.js");
const packageAnalyzer = require("@/analyze/package/index.js");

async function analyze(target, options = {}) {
  const targetPath = target || ".";

  const ignore = new Ignore(targetPath);

  ignore.printIgnoreInfo();

  const { package, deps, shared } = options;

  if (package || deps || shared) {
    await packageAnalyzer(targetPath, options);
  } else {
    await renderStructure(targetPath, options);
  }
}

module.exports = analyze;
