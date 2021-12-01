import fs from "fs";
import path from "path";

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

const resolveSrc = (relativePath: string) =>
  path.resolve(__dirname, "../../", relativePath);

export default {
  appPostCssConfig: resolveSrc("core/build/postcss.config.js"),
  appLoaders: resolveSrc("core/build/loaders"),
  appSrc: resolveSrc("."),
  appTsconfig: resolveSrc("core/client/tsconfig.json"),
  appPolyfill: resolveSrc("core/build/polyfills.ts"),
  appPublicPath: resolveSrc("core/build/publicPath.js"),
  appLocales: resolveSrc("locales"),
  appThemeVariables: resolveSrc("core/client/ui/theme/variables.ts"),
  appSassLikeVariables: resolveSrc("core/client/ui/theme/sassLikeVariables.ts"),
  appThemeStreamCSS: resolveSrc("core/client/ui/theme/stream.css"),
  appThemeAdminCSS: resolveSrc("core/client/ui/theme/admin.css"),
  appThemeMixinsCSS: resolveSrc("core/client/ui/theme/mixins.css"),

  appStreamHTML: resolveSrc("core/client/stream/index.html"),
  appStreamLocalesTemplate: resolveSrc("core/client/stream/locales.ts"),
  appStreamIndex: resolveSrc("core/client/stream/index.tsx"),
  appStreamBundle: resolveSrc("core/client/stream/stream.tsx"),

  appAuthHTML: resolveSrc("core/client/auth/index.html"),
  appAuthLocalesTemplate: resolveSrc("core/client/auth/locales.ts"),
  appAuthIndex: resolveSrc("core/client/auth/index.tsx"),

  appCountHTML: resolveSrc("core/client/count/index.html"),
  appCountIndex: resolveSrc("core/client/count/index.ts"),

  appInstallHTML: resolveSrc("core/client/install/index.html"),
  appInstallLocalesTemplate: resolveSrc("core/client/install/locales.ts"),
  appInstallIndex: resolveSrc("core/client/install/index.tsx"),

  appAccountHTML: resolveSrc("core/client/account/index.html"),
  appAccountLocalesTemplate: resolveSrc("core/client/account/locales.ts"),
  appAccountIndex: resolveSrc("core/client/account/index.tsx"),

  appAdminHTML: resolveSrc("core/client/admin/index.html"),
  appAdminLocalesTemplate: resolveSrc("core/client/admin/locales.ts"),
  appAdminIndex: resolveSrc("core/client/admin/index.tsx"),

  appEmbedIndex: resolveSrc("core/client/embed/index.ts"),
  appEmbedPolyfill: resolveSrc("core/client/embed/polyfills.ts"),
  appEmbedHTML: resolveSrc("core/client/embed/index.html"),
  appEmbedStoryHTML: resolveSrc("core/client/embed/story.html"),
  appEmbedStoryButtonHTML: resolveSrc("core/client/embed/storyButton.html"),
  appEmbedAMPHTML: resolveSrc("core/client/embed/amp.html"),
  appEmbedStoryAMPHTML: resolveSrc("core/client/embed/storyAMP.html"),

  appDistStatic: resolveApp("dist/static"),
  appPublic: resolveApp("public"),
  appPackageJson: resolveApp("package.json"),
  appNodeModules: resolveApp("node_modules"),

  appWebpackHotDevClient: resolveApp("scripts/webpackHotDevClient.js"),
};
