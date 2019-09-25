// index.d.ts

interface HtmlArgs {
  options: {
    filename: string;
  };
}

declare module "favicons-webpack-plugin" {
  import { Plugin } from "webpack";

  export default class FaviconsWebpackPlugin extends Plugin {
    constructor(options: string | FaviconsWebpackPlugin.FaviconOptions);
  }

  export namespace FaviconsWebpackPlugin {
    interface FaviconOptions {
      logo: string;
      prefix?: string;
      emitStats?: boolean;
      statsFilename?: string;
      persistentCache?: boolean;
      inject?: (arg: HtmlArgs) => boolean;
      background?: string;
      icon?: IconOptions;
    }

    interface IconOptions {
      android?: boolean;
      appleIcon?: boolean;
      appleStartup?: boolean;
      coast?: boolean;
      favicons?: boolean;
      firefox?: boolean;
      opengraph?: boolean;
      twitter?: boolean;
      yandex?: boolean;
      windows?: boolean;
    }
  }
}
