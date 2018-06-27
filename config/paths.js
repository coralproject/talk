"use strict";

// A script from `create-react-app` ejected `25.06.2018`.

const path = require("path");
const fs = require("fs");
const url = require("url");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(p, needsSlash) {
  const hasSlash = p.endsWith("/");
  if (hasSlash && !needsSlash) {
    return p.substr(p, p.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${p}/`;
  } else {
    return p;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");
  return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp(".env"),
  appPostCssConfig: resolveApp("config/postcss.config.js"),
  appJestConfig: resolveApp("config/jest.config.js"),
  appLoaders: resolveApp("loaders"),
  appDist: resolveApp("dist"),
  appPublic: resolveApp("public"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  appTsconfig: resolveApp("src/core/client/tsconfig.json"),
  appLocales: resolveApp("src/locales"),
  appThemeVariables: resolveApp("src/core/client/ui/theme/variables.ts"),
  testsSetup: resolveApp("src/setupTests.js"),
  appNodeModules: resolveApp("node_modules"),

  publicUrl: getPublicUrl(resolveApp("package.json")),
  servedPath: getServedPath(resolveApp("package.json")),

  appStreamHtml: resolveApp("src/core/client/stream/index.html"),
  appStreamLocalesTemplate: resolveApp("src/core/client/stream/locales.ts"),
  appStreamIndex: resolveApp("src/core/client/stream/index.tsx"),
};
