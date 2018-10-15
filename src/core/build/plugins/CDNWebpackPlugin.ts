import { Hooks } from "html-webpack-plugin";
import { Compiler, Plugin } from "webpack";

export interface CDNWebpackPluginOptions {
  production: boolean;
}

export default class CDNWebpackPlugin implements Plugin {
  private production: boolean;

  constructor({ production }: CDNWebpackPluginOptions) {
    this.production = production;
  }

  private prefixAttribute(attr: string | boolean) {
    if (!attr || typeof attr !== "string" || !attr.startsWith("/")) {
      return attr;
    }

    return "{{ staticURI }}" + attr;
  }

  private prefixTag = (tag: {
    tagName: string;
    attributes: Record<string, string | boolean>;
  }) => {
    switch (tag.tagName) {
      case "link":
        tag.attributes.href = this.prefixAttribute(tag.attributes.href);
        break;
      case "script":
        tag.attributes.src = this.prefixAttribute(tag.attributes.src);
        break;
    }
  };

  public apply = (compiler: Compiler) => {
    if (!this.production) {
      return;
    }

    compiler.hooks.compilation.tap("CDNWebpackPlugin", compilation => {
      (compilation.hooks as Hooks).htmlWebpackPluginAlterAssetTags.tapAsync(
        "CDNWebpackPlugin",
        (htmlPluginData, cb) => {
          // Prefix all the asset's url's with the template.
          htmlPluginData.head.forEach(this.prefixTag);
          htmlPluginData.body.forEach(this.prefixTag);

          // Insert the public path reference.
          htmlPluginData.body.unshift({
            tagName: "script",
            attributes: {
              type: "application/json",
              id: "config",
            },
            innerHTML: "{{ staticURI | dump | safe }}",
            voidTag: false,
          });

          return cb(null, htmlPluginData);
        }
      );
    });
  };
}
