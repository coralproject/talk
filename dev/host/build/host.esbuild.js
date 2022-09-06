const esbuild = require("esbuild");
const nativeNodeModulesPlugin = require("./nativeNodeModules");

esbuild.build({
  entryPoints: ["dev/host/src/index.ts"],
  bundle: true,
  outdir: "dev/host/output/",
  minify: false,
  sourcemap: true,
  platform: "node",
  target: "esnext",
  tsconfig: "dev/host/tsconfig.json",
  plugins: [nativeNodeModulesPlugin],
});
