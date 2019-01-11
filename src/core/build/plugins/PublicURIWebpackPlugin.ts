import HtmlWebpackPlugin from "html-webpack-plugin";
import { AsyncSeriesWaterfallHook } from "tapable";
import { Compiler, Plugin } from "webpack";

// Copied from @types/html-webpack-plugin
interface HtmlTagObject {
  /**
   * Attributes of the html tag
   * E.g. `{'disabled': true, 'value': 'demo'}`
   */
  attributes: {
    [attributeName: string]: string | boolean;
  };
  /**
   * Wether this html must not contain innerHTML
   * @see https://www.w3.org/TR/html5/syntax.html#void-elements
   */
  voidTag: boolean;
  /**
   * The tag name e.g. `'div'`
   */
  tagName: string;
  /**
   * Inner HTML The
   */
  innerHTML?: string;
}

type AlterAssetTagGroupsHook = AsyncSeriesWaterfallHook<{
  headTags: Array<HtmlTagObject | HtmlTagObject>;
  bodyTags: Array<HtmlTagObject | HtmlTagObject>;
  outputName: string;
  plugin: HtmlWebpackPlugin;
}>;

export default class PublicURIWebpackPlugin implements Plugin {
  private configTemplate: string;
  private prefixTemplate: string;

  constructor(configTemplate: string, prefixTemplate: string) {
    this.configTemplate = configTemplate;
    this.prefixTemplate = prefixTemplate;
  }

  private prefixAttribute(attr: string | boolean) {
    if (!attr || typeof attr !== "string" || !attr.startsWith("/")) {
      return attr;
    }

    return this.prefixTemplate + attr;
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
    compiler.hooks.compilation.tap("PublicURIWebpackPlugin", compilation => {
      const hooks = (HtmlWebpackPlugin as any).getHooks(compilation);
      (hooks.alterAssetTagGroups as AlterAssetTagGroupsHook).tapAsync(
        "PublicURIWebpackPlugin",
        (htmlPluginData, cb) => {
          // Prefix all the asset's url's with the template.
          htmlPluginData.headTags.forEach(this.prefixTag);
          htmlPluginData.bodyTags.forEach(this.prefixTag);

          // Insert the public path reference.
          htmlPluginData.bodyTags.unshift({
            tagName: "script",
            attributes: {
              type: "application/json",
              id: "config",
            },
            innerHTML: this.configTemplate,
            voidTag: false,
          });

          return cb(null, htmlPluginData);
        }
      );
    });
  };
}
