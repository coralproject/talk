declare module "react-dev-utils/InterpolateHtmlPlugin" {
  import { Plugin } from "webpack";
  export default class InterpolateHtmlPlugin extends Plugin {
    constructor(env: Record<string, string>);
  }
}

declare module "react-dev-utils/ModuleScopePlugin" {
  import { Plugin } from "webpack";
  export default class ModuleScopePlugin extends Plugin {
    constructor(rootPath: string, ignore: ReadonlyArray<string>);
  }
}

declare module "react-dev-utils/WatchMissingNodeModulesPlugin" {
  import { Plugin } from "webpack";
  export default class ModuleScopePlugin extends Plugin {
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
declare module "react-dev-utils/typescriptFormatter";
declare module "react-dev-utils/evalSourceMapMiddleware";
