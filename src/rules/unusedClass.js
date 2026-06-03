const Reporter = require("@core/reporter.js");
const { getClassNamesBySelector } = require("@utils/collectClass.js");

/**
 * 移除未使用的类选择器
 * @param {StyleModule} styleModule - 样式模块
 * @param {Object} options - 信息对象
 * @returns {StyleModule} - 样式模块
 */
function removeUnusedClass(styleModule, options = {}) {
  const { templateClasses } = options;

  const reporter = new Reporter();

  const unusedClasses = [];

  styleModule.blocks.forEach((style) => {
    style.ast?.walkRules((rule) => {
      const classes = getClassNamesBySelector(rule.selector);

      if (classes?.length) {
        let isUsed = false;

        classes.forEach((item) => {
          if (templateClasses?.has(item)) isUsed = true;
        });

        if (!isUsed) {
          unusedClasses.push(...classes);

          reporter.collect("unusedClass", rule, options);

          rule.remove();

          options.modified = true;
        }
      }
    });
  });

  return styleModule;
}

module.exports = removeUnusedClass;
