const { execa } = require("execa");
const prompts = require("prompts");
const chalk = require("chalk");
const fsExtra = require("fs-extra");
const semver = require("semver");
const pkg = require("../package.json");

const run = (bin, args, options) => {
  return execa(bin, args, { stdio: "inherit", ...options });
};

const args = process.argv.slice(2);

const isVersionOnly = args[0] === "--version-only";
const isPublishOnly = args[0] === "--publish-only";

const currentVersion = pkg.version;

const versionTypes = ["patch", "minor", "major", "custom"];

const inc = (type) => semver.inc(currentVersion, type);

function updateVersion(version) {
  pkg.version = version;
  fsExtra.writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
}

async function hasChanges() {
  const { stdout } = await run("git", ["status", "--porcelain"], {
    stdio: "pipe",
  });

  return stdout && stdout.trim().length > 0;
}

async function commitVersion(version) {
  const dirty = await hasChanges();

  if (!dirty) {
    console.log(chalk.red("🔔 提示: 未发现可提交的变更"));
    process.exit(0);
  }

  await run("git", ["pull"]);
  await run("git", ["add", "./package.json"]);
  await run("git", ["commit", "-m", `release: ${version}`]);
}

async function checkMainBranch() {
  const { stdout: branch } = await run("git", ["branch", "--show-current"], {
    stdio: "pipe",
  });

  return branch.trim() === "main";
}

async function build() {
  await run("pnpm", ["build"]);
}

async function publish() {
  const isMainBranch = await checkMainBranch();

  if (!isMainBranch) {
    console.log(chalk.red("🔔 提示: 请在 main 分支上发布"));
    process.exit(1);
  }

  console.log(chalk.cyan("🔔 提示: 正在构建..."));

  await build();

  console.log(chalk.cyan("🔔 提示: 正在发布..."));

  await run("npm", ["publish"]);

  console.log(chalk.green("🚀 提示: 发布完成！"));
}

async function publishAheadVersion() {
  const isMainBranch = await checkMainBranch();

  if (!isMainBranch) return false;

  const { stdout } = await run("npm", ["view", "codemod-clean", "version"], {
    stdio: "pipe",
  });

  const currentVersion = pkg.version;
  const latestVersion = stdout.trim();

  const isAhead = semver.gt(currentVersion, latestVersion.trim());

  if (!isAhead) return isAhead;

  const { action } = await prompts({
    type: "select",
    name: "action",
    message: [
      `当前版本：${currentVersion}`,
      `npm 最新版本：${latestVersion}`,
      "",
      "检测到当前版本已高于 npm 版本（dev 已 bump），请选择发布方式：",
    ].join("\n"),
    choices: [
      {
        title: "直接发布当前版本",
        value: "publish",
      },
      {
        title: "重新升级版本再发布",
        value: "reversion",
      },
    ],
    initial: 0,
  });

  if (action === "publish") {
    await publish();

    return isAhead;
  }

  return false;
}

async function release() {
  let version = "";

  const { versionType } = await prompts({
    type: "select",
    name: "versionType",
    message: "请选择发布升级版本类型",
    choices: versionTypes.map((type) => ({
      title: type === "custom" ? "自定义版本号" : `${type} ${inc(type)}`,
      value: type === "custom" ? "" : inc(type),
    })),
  });

  version = versionType;

  if (versionType === "custom") {
    const { customVersion } = await prompts({
      type: "text",
      name: "customVersion",
      message: "请输入自定义版本号",
    });

    version = customVersion;
  }

  if (!semver.valid(version)) {
    console.log(chalk.red("🔔 提示: 无效的目标版本号"));
    process.exit(1);
  }

  updateVersion(version);
  await commitVersion(version);

  try {
    console.log(chalk.cyan("🔔 提示: 正在推送代码..."));

    await run("git", ["push"]);
  } catch (error) {
    console.log(chalk.red("❌ 提示: 推送代码失败"));

    process.exit(1);
  }

  if (!isVersionOnly) {
    await publish();
  }
}

async function main() {
  if (isPublishOnly) {
    await publish();
    return;
  }

  const isAhead = await publishAheadVersion();

  if (!isAhead) {
    await release();
  }
}

main();
