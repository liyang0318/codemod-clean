const fsExtra = require("fs-extra");
const path = require("path");

function getStat(file) {
  return fsExtra.statSync(path.resolve(file));
}

module.exports = {
  getStat,
};
