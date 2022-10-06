/* eslint-disable no-restricted-globals */
import OptimizeCssnanoPlugin from "@intervolga/optimize-cssnano-plugin";
import bunyan from "bunyan";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { identity, uniq } from "lodash";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import WatchMissingNodeModulesPlugin from "react-dev-utils/WatchMissingNodeModulesPlugin";
import TerserPlugin from "terser-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import webpack, { Configuration, Plugin } from "webpack";
import WebpackAssetsManifest from "webpack-assets-manifest";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

// TODO: import form coral-common/version, for some reason this fails currently.
// Try again when we have a chance to upgrade typescript.
import { version } from "../common/version";
import { Config, createClientEnv } from "./config";
import paths from "./paths";

/**
 * filterPlugins will filter out null values from the array of plugins, allowing
 * easy embedded ternaries.
 *
 * @param plugins array of plugins and null values
 */
const filterPlugins = (plugins: Array<Plugin | null>): Plugin[] =>
  plugins.filter(identity) as Plugin[];

// Create the build logger.
const logger = bunyan.createLogger({
  name: "coral",
  level: "debug",
});

interface CreateWebpackOptions {
  appendPlugins?: any[];
  watch?: boolean;
}

const publicPath = "/";

/** These alias are required in production if you want to keep the profiling tools */
const reactProfilerAlias = {
  "react-dom$": "react-dom/profiling",
  "scheduler/tracing": "scheduler/tracing-profiling",
};

function insertLinkTag(linkTag: HTMLLinkElement) {
  const coralStream = (window as any).CoralStream;
  if (coralStream && coralStream.insertLinkTag) {
    coralStream.insertLinkTag(linkTag);
  } else {
    document.head.appendChild(linkTag);
  }
}

export default function createWebpackConfig(
  config: Config,
  { appendPlugins = [], watch = false }: CreateWebpackOptions = {}
): Configuration[] {
  logger.debug({ config: config.toString() }, "loaded configuration");

  const maxCores = config.get("maxCores");
  const env = createClientEnv(config);
  const disableSourcemaps = config.get("disableSourcemaps");
  const generateReport = config.get("generateReport");

  const isProduction = env.NODE_ENV === "production";
  /** Enable react profiler support: https://kentcdodds.com/blog/profile-a-react-app-for-performance  */
  const profilerSupport = isProduction && config.get("enableReactProfiler");
  const minimize = isProduction && !config.get("disableMinimize");
  const treeShake = isProduction || config.get("enableTreeShake");
  const enableBuildCache = !isProduction;

  const envStringified = {
    "process.env": Object.keys(env).reduce<Record<string, string>>(
      (result, key) => {
        result[key] = JSON.stringify((env as any)[key]);
        return result;
      },
      {
        TALK_VERSION: JSON.stringify(version),
      }
    ),
  };

  /**
   * ifWatch will only include the nodes if we're in watch mode.
   */
  const ifWatch = watch ? (...nodes: any[]) => nodes : () => [];

  /**
   * ifBuild will only include the nodes if we're in build mode.
   */
  const ifBuild = !watch ? (...nodes: any[]) => nodes : () => [];

  const localesOptions = {
    pathToLocales: paths.appLocales,

    // Default locale if none was specified.
    defaultLocale: config.get("defaultLocale"),

    // Fallback locale if a translation was not found.
    // If not set, will use the text that is already
    // in the code base.
    fallbackLocale: config.get("fallbackLocale"),

    // Common fluent files are always included in the locale bundles.
    commonFiles: ["framework.ftl", "common.ftl", "ui.ftl"],

    // Locales that come with the main bundle. Others are loaded on demand.
    bundled: uniq([config.get("defaultLocale"), config.get("fallbackLocale")]),

    // All available locales can be loadable on demand.
    // To restrict available locales set:
    // availableLocales: [config.get("defaultLocale")],
  };

  const additionalPlugins = [
    new MiniCssExtractPlugin({
      filename: isProduction
        ? "assets/css/[name].[contenthash].css"
        : "assets/css/[name].[hash].css",
      chunkFilename: isProduction
        ? "assets/css/[id].[contenthash].css"
        : "assets/css/[id].[hash].css",
      insert: insertLinkTag,
    }),
    ...ifBuild(
      isProduction &&
        new OptimizeCssnanoPlugin({
          sourceMap: !disableSourcemaps,
          cssnanoOptions: {
            preset: [
              "default",
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }),
      // Pre-compress all the assets as they will be served as is.
      new CompressionPlugin({})
    ),
    ...ifWatch(
      // Add module names to factory functions so they appear in browser profiler.
      new webpack.NamedModulesPlugin(),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebookincubator/create-react-app/issues/240
      new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebookincubator/create-react-app/issues/186
      new WatchMissingNodeModulesPlugin(paths.appNodeModules)
    ),
  ];

  const devtool = disableSourcemaps
    ? false
    : isProduction
    ? // We generate sourcemaps in production. This is slow but gives good results.
      // You can exclude the *.map files from the build during deployment.
      "source-map"
    : // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
      // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
      "cheap-module-source-map";

  const baseConfig: Configuration = {
    stats: {
      // https://github.com/TypeStrong/ts-loader#transpileonly-boolean-defaultfalse
      // Using transpilation only without typechecks gives warnings when we reexport types.
      // We can ignore them here.
      warningsFilter: /export .* was not found in/,
    },
    // Set webpack mode.
    mode: isProduction ? "production" : "development",
    optimization: {
      concatenateModules: isProduction,
      providedExports: true,
      usedExports: true,
      // We can't use side effects because it disturbs css order
      // https://github.com/webpack/webpack/issues/7094.
      sideEffects: false,
      splitChunks: {
        chunks: config.get("disableChunkSplitting") ? "async" : "all",
      },
      minimize: minimize || treeShake,
      minimizer: [
        // Minify the code.
        new TerserPlugin({
          terserOptions: {
            compress: minimize
              ? {}
              : {
                  defaults: false,
                  dead_code: true,
                  pure_getters: true,
                  side_effects: true,
                  unused: true,
                  passes: 2,
                },
            mangle: minimize,
            keep_classnames: profilerSupport,
            keep_fnames: profilerSupport,
            output: {
              comments: !minimize,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebookincubator/create-react-app/issues/2488
              ascii_only: true,
            },
            safari10: true,
          },
          cache: enableBuildCache,
          parallel: 4,
          sourceMap: !disableSourcemaps,
        }),
      ],
    },
    devtool,
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    // The first two entry points enable "hot" CSS and auto-refreshes for JS.
    output: {
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: !isProduction,
      // The dist folder.
      path: paths.appDistStatic,
      // Configure the hash digest to use a longer hash.
      hashFunction: "sha256",
      hashDigestLength: 32,
      // Generated JS file names (with nested folders).
      // There will be one main bundle, and one file per asynchronous chunk.
      filename: isProduction
        ? "assets/js/[name].[contenthash].js"
        : "assets/js/[name].[hash].js",
      chunkFilename: isProduction
        ? "assets/js/[name].[contenthash].chunk.js"
        : "assets/js/[name].[hash].chunk.js",
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: (info: any) =>
        path
          .relative(paths.appSrc, info.absoluteResourcePath)
          .replace(/\\/g, "/"),
    },
    resolve: {
      extensions: [".js", ".json", ".ts", ".tsx"],
      plugins: [
        // Support `tsconfig.json` `path` setting.
        new TsconfigPathsPlugin({
          configFile: paths.appTsconfig,
          extensions: [".js", ".ts", ".tsx"],
        }),
      ],
      alias: profilerSupport ? reactProfilerAlias : {},
    },
    resolveLoader: {
      // Add path to our own loaders.
      modules: ["node_modules", paths.appLoaders],
    },
    module: {
      // https://github.com/TypeStrong/ts-loader#transpileonly-boolean-defaultfalse
      // Using transpilation only without typechecks gives warnings when we reexport types
      // thus we can't turn on `strictExportPresence` which would turn warnings into errors.
      strictExportPresence: false,
      rules: [
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
                    ...localesOptions,
                    // Target specifies the prefix for fluent files to be loaded.
                    // ${target}-xyz.ftl and ${†arget}.ftl are loaded into the locales.
                    target: "stream",
                  },
                },
              ],
            },
            {
              test: paths.appAuthLocalesTemplate,
              use: [
                // This is the locales loader that loads available locales
                // from a particular target.
                {
                  loader: "locales-loader",
                  options: {
                    ...localesOptions,
                    // Target specifies the prefix for fluent files to be loaded.
                    // ${target}-xyz.ftl and ${†arget}.ftl are loaded into the locales.
                    target: "auth",
                  },
                },
              ],
            },
            {
              test: paths.appAccountLocalesTemplate,
              use: [
                // This is the locales loader that loads available locales
                // from a particular target.
                {
                  loader: "locales-loader",
                  options: {
                    ...localesOptions,
                    // Target specifies the prefix for fluent files to be loaded.
                    // ${target}-xyz.ftl and ${†arget}.ftl are loaded into the locales.
                    target: "account",
                  },
                },
              ],
            },
            {
              test: paths.appAdminLocalesTemplate,
              use: [
                // This is the locales loader that loads available locales
                // from a particular target.
                {
                  loader: "locales-loader",
                  options: {
                    ...localesOptions,
                    // Target specifies the prefix for fluent files to be loaded.
                    // ${target}-xyz.ftl and ${†arget}.ftl are loaded into the locales.
                    target: "admin",
                  },
                },
              ],
            },
            {
              test: paths.appInstallLocalesTemplate,
              use: [
                // This is the locales loader that loads available locales
                // from a particular target.
                {
                  loader: "locales-loader",
                  options: {
                    ...localesOptions,
                    // Target specifies the prefix for fluent files to be loaded.
                    // ${target}-xyz.ftl and ${†arget}.ftl are loaded into the locales.
                    target: "install",
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
              test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: 10000,
                name: isProduction
                  ? "assets/media/[name].[contenthash].[ext]"
                  : "assets/media/[name].[ext]",
              },
            },
            {
              test: /\.css\.ts$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: {
                      localIdentName: "[name]-[local]-[contenthash]",
                    },
                    importLoaders: 2,
                    sourceMap: !disableSourcemaps,
                  },
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    config: {
                      path: paths.appPostCssConfig,
                    },
                    parser: "postcss-js",
                  },
                },
                {
                  loader: require.resolve("babel-loader"),
                  options: {
                    configFile: false,
                    babelrc: false,
                    presets: [
                      "@babel/typescript",
                      [
                        "@babel/env",
                        { targets: { node: "current" }, modules: "commonjs" },
                      ],
                    ],
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: enableBuildCache,
                  },
                },
              ],
            },
            // Process JS with Babel.
            {
              test: /\.(ts|tsx)$/,
              include: paths.appSrc,
              use: [
                {
                  loader: "thread-loader",
                  options: {
                    // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                    workers: maxCores - 1,
                    poolTimeout: watch ? Infinity : 500, // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
                  },
                },
                {
                  loader: require.resolve("babel-loader"),
                  options: {
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: enableBuildCache,
                  },
                },
                {
                  loader: require.resolve("ts-loader"),
                  options: {
                    configFile: paths.appTsconfig,
                    compilerOptions: {
                      target: "es2015",
                      module: "esnext",
                      jsx: "preserve",
                      noEmit: false,
                      sourceMap: !disableSourcemaps,
                    },
                    transpileOnly: true,
                    // Overwrites the behavior of `include` and `exclude` to only
                    // include files that are actually being imported and which
                    // are necessary to compile the bundle.
                    onlyCompileBundledFiles: true,
                    happyPackMode: true, // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                  },
                },
              ],
            },
            // Makes sure node_modules are transpiled the way we need them to be.
            {
              test: /\.js$/,
              include: /node_modules\//,
              exclude:
                /node_modules\/(@babel|babel|core-js|webpack\/|regenerator-runtime)/,
              use: [
                {
                  loader: require.resolve("babel-loader"),
                  options: {
                    cacheDirectory: enableBuildCache,
                  },
                },
              ],
            },
            // typography.css must be included in the light dom whereas the other css
            // could be in the shadow dom. That's why we are treating it here separately.
            {
              test: /\/typography\.css$/,
              use: [
                {
                  loader: "file-loader",
                  options: {
                    name: "assets/css/[name].[hash].css",
                  },
                },
                {
                  loader: "extract-loader",
                },
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: {
                      localIdentName: "[name]-[local]-[contenthash]",
                    },
                    importLoaders: 1,
                    sourceMap: !disableSourcemaps,
                  },
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    config: {
                      path: paths.appPostCssConfig,
                    },
                    sourceMap: !disableSourcemaps,
                  },
                },
              ],
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // We use a plugin to extract that CSS to a file.
            {
              test: /\.css$/,
              exclude: /\/typography\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: {
                      localIdentName: "[name]-[local]-[contenthash]",
                    },
                    importLoaders: 1,
                    sourceMap: !disableSourcemaps,
                  },
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    config: {
                      path: paths.appPostCssConfig,
                    },
                    sourceMap: !disableSourcemaps,
                  },
                },
              ],
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // When building, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|ts|tsx)$/, /\.html$/, /\.json$/],
              loader: require.resolve("file-loader"),
              options: {
                // Because the resources loaded via CSS can sometimes be loaded
                // directly from a CSS file, this will ensure that they are
                // relative to those referencing files.
                publicPath: (loaderPublicPath: string) => {
                  return "../../" + loaderPublicPath;
                },
                name: isProduction
                  ? "assets/media/[name].[contenthash].[ext]"
                  : "assets/media/[name].[ext]",
              },
            },
          ],
        },
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
    plugins: [
      // TODO: (cvle) this should work in build too but for some reasons it terminates the build afterwards.
      // Preventing from running post build steps.
      ...ifWatch(
        // We run eslint in a separate process to have a quicker build.
        new ForkTsCheckerWebpackPlugin({
          eslint: true,
          typescript: require.resolve("typescript"),
          async: true,
          // TODO: (cvle) For some reason if incremental build is turned on it does not find lint errors during initial build.
          useTypescriptIncrementalApi: false,
          checkSyntacticErrors: true,
          tsconfig: paths.appTsconfig,
        })
      ),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
      new webpack.DefinePlugin(envStringified),
      // If stats are enabled, output them!
      generateReport
        ? new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: "report-assets.html",
          })
        : null,
      ...additionalPlugins,
      ...appendPlugins,
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
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: isProduction && "warning",
    },
  };

  const devServerEntries = !watch
    ? []
    : [
        // Include an alternative client for WebpackDevServer. A client's job is to
        // connect to WebpackDevServer by a socket and get notified about changes.
        // When you save a file, the client will either apply hot updates (in case
        // of CSS changes), or refresh the page (in case of JS changes). When you
        // make a syntax error, this client will display a syntax error overlay.
        // Note: instead of the default WebpackDevServer client, we use a custom one
        // to bring better experience for Create React App users. You can replace
        // the line below with these two lines if you prefer the stock client:
        // require.resolve('webpack-dev-server/client') + '?/',
        // require.resolve('webpack/hot/dev-server'),
        paths.appWebpackHotDevClient,
      ];

  return [
    /* Webpack config for our different target, e.g. stream, admin... */
    {
      ...baseConfig,
      entry: {
        stream: [...devServerEntries, paths.appStreamIndex],
        auth: [
          ...devServerEntries,
          paths.appAuthIndex,
          // Remove deactivated entries.
        ],
        install: [...devServerEntries, paths.appInstallIndex],
        account: [...devServerEntries, paths.appAccountIndex],
        admin: [...devServerEntries, paths.appAdminIndex],
      },
      output: {
        ...baseConfig.output,
        // Each config needs a unique jsonpFunction name to avoid collisions of chunks.
        jsonpFunction: "coralWebpackJsonp",
      },
      plugins: filterPlugins([
        ...baseConfig.plugins!,
        ...ifWatch(
          // This is necessary to emit hot updates
          new webpack.HotModuleReplacementPlugin({
            multiStep: true,
          })
        ),
        new WebpackAssetsManifest({
          output: "asset-manifest.json",
          entrypoints: true,
          integrity: true,
        }),
      ]),
    },
    /* Webpack config for our embed */
    {
      ...baseConfig,
      optimization: {
        ...baseConfig.optimization,
        // Ensure that we never split the main library into chunks.
        splitChunks: {
          chunks: "async",
        },
        // We can turn on sideEffects here as we don't use
        // css here and don't run into: https://github.com/webpack/webpack/issues/7094
        sideEffects: true,
      },
      entry: [paths.appEmbedIndex],
      output: {
        ...baseConfig.output,
        // Each config needs a unique jsonpFunction name to avoid collisions of chunks.
        jsonpFunction: "coralEmbedWebpackJsonp",
        library: "Coral",
        // don't hash the embed, cache-busting must be completed by the requester
        // as this lives in a static template on the embed site.
        filename: "assets/js/embed.js",
      },
      plugins: filterPlugins([
        ...baseConfig.plugins!,
        ...ifWatch(
          // Generates an `embed.html` file with the <script> injected.
          new HtmlWebpackPlugin({
            filename: "embed.html",
            template: paths.appEmbedHTML,
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "story.html",
            template: paths.appEmbedStoryHTML,
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "storyButton.html",
            template: paths.appEmbedStoryButtonHTML,
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "amp.html",
            template: paths.appEmbedAMPHTML,
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "storyAMP.html",
            template: paths.appEmbedStoryAMPHTML,
            inject: false,
          })
        ),
        new WebpackAssetsManifest({
          output: "embed-asset-manifest.json",
          entrypoints: true,
          integrity: true,
        }),
      ]),
    },
    /* Webpack config for count */
    {
      ...baseConfig,
      optimization: {
        ...baseConfig.optimization,
        // Ensure that we never split the main library into chunks.
        splitChunks: {
          chunks: "async",
        },
        // We can turn on sideEffects here as we don't use
        // css here and don't run into: https://github.com/webpack/webpack/issues/7094
        sideEffects: true,
      },
      entry: [paths.appCountIndex],
      output: {
        ...baseConfig.output,
        // Each config needs a unique jsonpFunction name to avoid collisions of chunks.
        jsonpFunction: "coralCountWebpackJsonp",
        // don't hash the count, cache-busting must be completed by the requester
        // as this lives in a static template on the embed site.
        filename: "assets/js/count.js",
      },
      plugins: filterPlugins([
        ...baseConfig.plugins!,
        ...ifWatch(
          // Generates an `embed.html` file with the <script> injected.
          new HtmlWebpackPlugin({
            filename: "count.html",
            template: paths.appCountHTML,
            inject: "body",
          })
        ),
        new WebpackAssetsManifest({
          output: "count-asset-manifest.json",
          entrypoints: true,
          integrity: true,
        }),
      ]),
    },
    /* Webpack config for frame bundle */
    {
      ...baseConfig,
      optimization: {
        ...baseConfig.optimization,
        // Ensure that we never split the main library into chunks.
        splitChunks: {
          chunks: "async",
        },
        // We can turn on sideEffects here as we don't use
        // css here and don't run into: https://github.com/webpack/webpack/issues/7094
        sideEffects: true,
      },
      output: {
        ...baseConfig.output,
        // Each config needs a unique jsonpFunction name to avoid collisions of chunks.
        jsonpFunction: "coralFrameWebpackJsonp",
      },
      entry: {
        frame: [paths.appFrameIndex],
      },
      plugins: filterPlugins([
        ...baseConfig.plugins!,
        new WebpackAssetsManifest({
          output: "frame-asset-manifest.json",
          entrypoints: true,
          integrity: true,
        }),
      ]),
    },
  ];
}
