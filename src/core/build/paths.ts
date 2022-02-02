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
  appLocales: resolveSrc("locales"),
  appSassLikeVariables: resolveSrc("core/client/ui/theme/sassLikeVariables.ts"),
  appThemeMixinsCSS: resolveSrc("core/client/ui/theme/mixins.css"),

  appStreamLocalesTemplate: resolveSrc("core/client/stream/locales.ts"),
  appStreamIndex: resolveSrc("core/client/stream/index.tsx"),

  appAuthLocalesTemplate: resolveSrc("core/client/auth/locales.ts"),
  appAuthIndex: resolveSrc("core/client/auth/index.tsx"),

  appCountHTML: resolveSrc("core/client/count/index.html"),
  appCountIndex: resolveSrc("core/client/count/index.ts"),

  appFrameIndex: resolveSrc("core/client/frame/index.ts"),

  appInstallLocalesTemplate: resolveSrc("core/client/install/locales.ts"),
  appInstallIndex: resolveSrc("core/client/install/index.tsx"),

  appAccountLocalesTemplate: resolveSrc("core/client/account/locales.ts"),
  appAccountIndex: resolveSrc("core/client/account/index.tsx"),

  appAdminLocalesTemplate: resolveSrc("core/client/admin/locales.ts"),
  appAdminIndex: resolveSrc("core/client/admin/index.tsx"),

  appEmbedIndex: resolveSrc("core/client/embed/index.ts"),
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
