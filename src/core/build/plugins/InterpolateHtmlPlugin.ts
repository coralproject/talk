/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This Webpack plugin lets us interpolate custom variables into `index.html`.
// Usage: `new InterpolateHtmlPlugin({ 'MY_VARIABLE': 42 })`
// Then, you can use %MY_VARIABLE% in your `index.html`.

// It works in tandem with HtmlWebpackPlugin.
// Learn more about creating plugins like this:
// https://github.com/ampedandwired/html-webpack-plugin#events

import escapeStringRegexp from "escape-string-regexp";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { Compiler, Plugin } from "webpack";

export default class InterpolateHtmlPlugin implements Plugin {
  private replacements: Record<string, string>;

  constructor(replacements: Record<string, string>) {
    this.replacements = replacements;
  }

  public apply(compiler: Compiler) {
    // The following was modified from the original source:
    // https://github.com/jussikinnula/react-dev-utils/blob/9c290281877c026774c909b2900000c653f431a4/InterpolateHtmlPlugin.js
    // to support Webpack 4.
    compiler.hooks.compilation.tap("InterpolateHtmlPlugin", compilation => {
      const hooks = (HtmlWebpackPlugin as any).getHooks(compilation);
      hooks.afterTemplateExecution.tap("InterpolateHtmlPlugin", (data: any) => {
        // Run HTML through a series of user-specified string replacements.
        Object.keys(this.replacements).forEach(key => {
          const value = this.replacements[key];
          data.html = data.html.replace(
            new RegExp("%" + escapeStringRegexp(key) + "%", "g"),
            value
          );
        });
      });
    });
  }
}
