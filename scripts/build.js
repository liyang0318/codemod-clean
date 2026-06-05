const esbuild = require("esbuild");
const fsExtra = require("fs-extra");
const chalk = require("chalk");

const externals = [
  "hamlet",
  "whiskers",
  "haml-coffee",
  "hogan.js",
  "templayed",
  "underscore",
  "walrus",
  "mustache",
  "just",
  "ect",
  "velocityjs",
  "dustjs-linkedin",
  "atpl",
  "liquor",
  "twig",
  "ejs",
  "eco",
  "jazz",
  "jqtpl",
  "hamljs",
  "mote",
  "toffee",
  "dot",
  "bracket-template",
  "ractive",
  "htmling",
  "babel-core",
  "plates",
  "react-dom/server",
  "react",
  "vash",
  "slm",
  "marko",
  "teacup/lib/express",
  "coffee-script",
  "squirrelly",
  "twing",
];

async function build() {
  // 清理 dist 目录
  console.log("🧹 Cleaning dist directory...");

  await fsExtra.emptyDir("dist");

  console.log("📦 Building with esbuild...");

  await esbuild.build({
    entryPoints: ["bin/cli.js"],
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node16",
    outfile: "dist/cli.js",
    sourcemap: true,
    minify: true,
    external: externals,
  });

  console.log(chalk.green("✅ Build complete!"));
}

build().catch((err) => {
  console.log(chalk.red("❌ Build failed!"), err);
  process.exit(1);
});
