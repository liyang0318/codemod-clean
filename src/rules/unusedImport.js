const traverse = require("@babel/traverse").default;
const Reporter = require("../core/reporter.js");

function removeUnusedImport(ast, options = {}) {
  const reporter = new Reporter();

  traverse(ast, {
    ImportDeclaration(path) {
      const { specifiers } = path.node;

      const useds = specifiers.filter((spec) => {
        const binding = path.scope.getBinding(spec.local.name);
        return binding && binding.referenced;
      });

      if (!useds.length) {
        reporter.collect("unusedImport", path.node, options);
        path.remove();
      }
    },
  });
}

module.exports = removeUnusedImport;
