const { execa, execaCommand } = require("execa");
const prompts = require("prompts");
const chalk = require("chalk");
const fsExtra = require("fs-extra");
const semver = require("semver");
const pkg = require("../package.json");

const run = (bin, args, options) => {
  return execa(bin, args, { stdio: "inherit", ...options });
};

const args = process.argv.slice(2);
const currentVersion = pkg.version;

const versionTypes = ["patch", "minor", "major", "custom"];

const inc = (type) => semver.inc(currentVersion, type);

function updateVersion(version) {
  pkg.version = version;
  fsExtra.writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
}

async function hasChanges() {
  const { stdout } = await run("git", ["status", "--porcelain"]);
  return stdout.trim().length > 0;
}

async function commitVersion(version) {
  const dirty = await hasChanges();

  if (!dirty) {
    console.log(chalk.red("🔔 提示: 未发现可提交的变更"));
    process.exit(0);
  }

  await run("git", ["add", "./package.json"]);
  await run("git", ["commit", "-m", `release: ${version}`]);
}

async function release() {
  const targetVersion = args[0];

  if (!targetVersion) {
    const { versionType } = await prompts({
      type: "select",
      name: "versionType",
      message: "请选择发布升级版本类型",
      choices: versionTypes.map((type) => ({
        title: type === "custom" ? "自定义版本号" : `${type} ${inc(type)}`,
        value: type,
      })),
    });

    if (versionType === "custom") {
      const { customVersion } = await prompts({
        type: "text",
        name: "customVersion",
        message: "请输入自定义版本号",
      });

      updateVersion(customVersion);

      await commitVersion(customVersion);
    } else {
      await execaCommand(`pnpm version:${versionType}`);
    }
  } else {
    if (!semver.valid(targetVersion)) {
      console.log(chalk.red("🔔 提示: 无效的目标版本号"));
      process.exit(1);
    }

    updateVersion(targetVersion);
    await commitVersion(targetVersion);
  }

  console.log(chalk.cyan("🔔 提示: 正在推送代码..."));
  await run("git", ["push"]);

  console.log(chalk.cyan("🔔 提示: 正在发布..."));
  await run("npm", ["publish"]);

  console.log(chalk.green("🚀 提示: 发布完成！"));
}

release();
