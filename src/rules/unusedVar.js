const traverse = require("@babel/traverse").default;
const Reporter = require("../core/reporter.js");

function removeUnusedVar(ast, options = {}) {
  const reporter = new Reporter();

  traverse(ast, {
    VariableDeclarator(path) {
      const name = path.node.id.name;
      const binding = path.scope.getBinding(name);

      if (binding && !binding.referenced) {
        reporter.collect("unusedVar", path.node, options);
        path.remove();
      }
    },
  });

  return ast;
}

module.exports = removeUnusedVar;
