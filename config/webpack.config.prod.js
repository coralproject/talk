"use strict";

const autoprefixer = require("autoprefixer");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getClientEnvironment = require("./env");
const paths = require("./paths");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === "./";
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified["process.env"].NODE_ENV !== '"production"') {
  throw new Error("Production builds must have NODE_ENV=production.");
}

// Note: defined here because it will be used more than once.
// We use [md5:contenthash:hex:20] instead of [contenthash:8]
// because of this bug https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/763.
// TODO: Repalce with mini-css-extract-plugin once it supports HMR.
// https://github.com/webpack-contrib/mini-css-extract-plugin
const cssFilename = "static/css/[name].[md5:contenthash:hex:20].css";

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split("/").length).join("../") }
  : {};

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,

  // Set webpack mode.
  mode: "production",

  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: shouldUseSourceMap ? "source-map" : false,

  // In production, we only want to load the polyfills and the app code.
  entry: [require.resolve("./polyfills"), paths.appStreamIndex],
  output: {
    // The dist folder.
    path: paths.appDist,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: "static/js/[name].[chunkhash:8].js",
    chunkFilename: "static/js/[name].[chunkhash:8].chunk.js",
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, "/"),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ["node_modules", paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: [
      ".web.js",
      ".mjs",
      ".js",
      ".json",
      ".web.jsx",
      ".jsx",
      ".ts",
      ".tsx",
    ],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      "react-native": "react-native-web",
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      // Support `tsconfig.json` `path` setting.
      new TsconfigPathsPlugin({
        configFile: paths.appTsconfig,
        extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"],
      }),
    ],
  },
  resolveLoader: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ["node_modules", paths.appNodeModules, paths.appLoaders].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        enforce: "pre",
        use: [
          {
            options: {
              tsConfigFile: paths.appTsconfig,
            },
            loader: require.resolve("tslint-loader"),
          },
        ],
        include: paths.appSrc,
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: paths.appStreamLocalesTemplate,
            use: [
              // This is the locales loader that loads available locales
              // from a particular target.
              {
                loader: "locales-loader",
                options: {
                  pathToLocales: paths.appLocales,

                  // Default locale if non could be negotiated.
                  defaultLocale: "en-US",

                  // Fallback locale if a translation was not found.
                  // If not set, will use the text that is already
                  // in the code base.
                  fallbackLocale: "en-US",

                  // Common fluent files are always included in the locale bundles.
                  commonFiles: ["framework.ftl", "common.ftl"],

                  // Locales that come with the main bundle. Others are loaded on demand.
                  bundled: ["en-US"],

                  // Target specifies the prefix for fluent files to be loaded.
                  // ${target}-xyz.ftl and ${†arget}.ftl are loaded into the locales.
                  target: "stream",

                  // All available locales can be loadable on demand.
                  // To restrict available locales set:
                  // availableLocales: ["en-US"]
                },
              },
            ],
          },
          // Loader for our fluent files.
          {
            test: /\.ftl$/,
            use: ["raw-loader"],
          },
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs|ts|tsx)$/,
            include: paths.appSrc,
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  compact: true,
                },
              },
              {
                loader: "ts-loader",
                options: {
                  compilerOptions: {
                    target: "es2015",
                    module: "esnext",
                    jsx: "preserve",
                    noEmit: false,
                  },
                },
              },
            ],
          },

          // The notation here is somewhat confusing.
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader normally turns CSS into JS modules injecting <style>,
          // but unlike in development configuration, we do something different.
          // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
          // (second argument), then grabs the result CSS and puts it into a
          // separate file in our build process. This way we actually ship
          // a single CSS file in production instead of JS code injecting <style>
          // tags. If you use code splitting, however, any async bundles will still
          // use the "style" loader inside the async code so CSS from them won't be
          // in the main CSS file.
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: {
                    loader: require.resolve("style-loader"),
                    options: {
                      hmr: false,
                    },
                  },
                  use: [
                    {
                      loader: require.resolve("css-loader"),
                      options: {
                        modules: true,
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: shouldUseSourceMap,
                      },
                    },
                    {
                      loader: require.resolve("postcss-loader"),
                      options: {
                        config: {
                          path: paths.appPostCssConfig,
                        },
                      },
                    },
                  ],
                },
                extractTextPluginOptions
              )
            ),
            // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs|ts|tsx)$/, /\.html$/, /\.json$/],
            loader: require.resolve("file-loader"),
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appStreamHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(env.raw),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    // Minify the code.
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebookincubator/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
        },
        mangle: {
          safari10: true,
        },
        output: {
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebookincubator/create-react-app/issues/2488
          ascii_only: true,
        },
        sourceMap: shouldUseSourceMap,
      },
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin({
      filename: cssFilename,
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: "asset-manifest.json",
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty",
  },
};
