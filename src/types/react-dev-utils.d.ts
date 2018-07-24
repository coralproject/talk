declare module "react-dev-utils/InterpolateHtmlPlugin" {
  export default class InterpolateHtmlPlugin {
    constructor(env: Record<string, string>);
  }
}

declare module "react-dev-utils/ModuleScopePlugin" {
  export default class ModuleScopePlugin {
    constructor(rootPath: string, ignore: ReadonlyArray<string>);
  }
}

declare module "react-dev-utils/WatchMissingNodeModulesPlugin" {
  export default class ModuleScopePlugin {
    constructor(nodeModulesPath: string);
  }
}

declare module "react-dev-utils/errorOverlayMiddleware";
declare module "react-dev-utils/ignoredFiles";
declare module "react-dev-utils/noopServiceWorkerMiddleware";
declare module "react-dev-utils/WebpackDevServerUtils";
declare module "react-dev-utils/FileSizeReporter";
declare module "react-dev-utils/formatWebpackMessages";
declare module "react-dev-utils/printBuildError";
