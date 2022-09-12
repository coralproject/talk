const esbuild = require("esbuild");
const nativeNodeModulesPlugin = require("./nativeNodeModules");

esbuild.build({
  entryPoints: ["dev/cdn/src/index.ts"],
  bundle: true,
  outdir: "dev/cdn/output/",
  minify: false,
  sourcemap: true,
  platform: "node",
  target: "esnext",
  tsconfig: "dev/cdn/tsconfig.json",
  plugins: [nativeNodeModulesPlugin],
});
