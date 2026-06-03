const MUTUALLY_EXCLUSIVE = [
  ["fix", "dry"],
  ["json", "stylish"],
];

const ANALYZE_MUTUALLY_EXCLUSIVE = [["json", "tree"]];

const SUPPORTED_EXTENSIONS = [".js", ".ts", ".vue"];
const SUPPORTED_EXTENSIONS_PATTERN = "**/*.{js,ts,vue}";

module.exports = {
  MUTUALLY_EXCLUSIVE,
  ANALYZE_MUTUALLY_EXCLUSIVE,
  SUPPORTED_EXTENSIONS,
  SUPPORTED_EXTENSIONS_PATTERN,
};
