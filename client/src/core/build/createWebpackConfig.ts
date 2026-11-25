/* eslint-disable no-restricted-globals */
import bunyan from "bunyan";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { identity, uniq } from "lodash";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import webpack, { Configuration, WebpackPluginInstance } from "webpack";
import { WebpackAssetsManifest } from "webpack-assets-manifest";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

// TODO: import form coral-common/version, for some reason this fails currently.
// Try again when we have a chance to upgrade typescript.
import { version } from "coral-common/common/lib/version";
import { Config, createClientEnv } from "./config";
import paths from "./paths";

/**
 * filterPlugins will filter out null values from the array of plugins, allowing
 * easy embedded ternaries.
 * @param plugins array of plugins and null values
 */
const filterPlugins = (plugins: any[]): WebpackPluginInstance[] =>
  plugins.filter(identity) as WebpackPluginInstance[];

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
        : "assets/css/[name].[fullhash].css",
      chunkFilename: isProduction
        ? "assets/css/[id].[contenthash].css"
        : "assets/css/[id].[fullhash].css",
      insert: insertLinkTag,
    }),
    ...ifBuild(
      // Pre-compress all the assets as they will be served as is.
      new CompressionPlugin({})
    ),
    ...ifWatch(
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebookincubator/create-react-app/issues/240
      new CaseSensitivePathsPlugin()
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
    target: ["web", "es5"],
    infrastructureLogging: {
      level: watch ? "error" : "info",
    },
    stats: {},
    // ts-loader transpiles without typechecking, so type-only reexports can
    // appear as missing runtime exports.
    ignoreWarnings: [/export .* was not found in/],
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
      moduleIds: watch ? "named" : "size",
      chunkIds: watch ? "named" : "size",
      minimize: minimize || treeShake,
      minimizer: [
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
            format: {
              comments: !minimize,
              ascii_only: true,
            },
            safari10: true,
          },
          parallel: 4,
          extractComments: false,
        }),
        ...(isProduction
          ? [
              new CssMinimizerPlugin({
                minify: CssMinimizerPlugin.cleanCssMinify,
              }),
            ]
          : []),
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
        : "assets/js/[name].[fullhash].js",
      chunkFilename: isProduction
        ? "assets/js/[name].[contenthash].chunk.js"
        : "assets/js/[name].[fullhash].chunk.js",
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: (info: { absoluteResourcePath: string }) =>
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
      // Some libraries import Node modules but do not use them in the browser.
      fallback: {
        child_process: false,
        dgram: false,
        fs: false,
        net: false,
        tls: false,
      },
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
          test: /\.m?js$/,
          resolve: {
            fullySpecified: false,
          },
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
              type: "asset/source",
            },
            // Asset modules embed assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            {
              test: [/\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
              type: "asset",
              parser: {
                dataUrlCondition: {
                  maxSize: 10000,
                },
              },
              generator: {
                filename: isProduction
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
                    execute: true,
                    postcssOptions: {
                      config: paths.appPostCssConfig,
                      parser: "postcss-js",
                    },
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
                    workers: maxCores,
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
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    modules: false,
                    importLoaders: 1,
                    sourceMap: !disableSourcemaps,
                  },
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    postcssOptions: {
                      config: paths.appPostCssConfig,
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
                    postcssOptions: {
                      config: paths.appPostCssConfig,
                    },
                    sourceMap: !disableSourcemaps,
                  },
                },
              ],
            },
            // Asset modules make sure those assets get served by WebpackDevServer.
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
              type: "asset/resource",
              generator: {
                // Resources referenced from emitted CSS need a relative URL.
                publicPath: "../../",
                filename: isProduction
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
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: isProduction && "warning",
    },
  };

  return [
    /* Webpack config for our different target, e.g. stream, admin... */
    {
      ...baseConfig,
      entry: {
        stream: [paths.appStreamIndex],
        typography: [paths.appTypographyCSS],
        auth: [paths.appAuthIndex],
        install: [paths.appInstallIndex],
        account: [paths.appAccountIndex],
        admin: [paths.appAdminIndex],
      },
      output: {
        ...baseConfig.output,
        // Each config needs a unique chunk loading name to avoid collisions.
        chunkLoadingGlobal: "coralWebpackJsonp",
      },
      plugins: filterPlugins([
        ...baseConfig.plugins!,
        new WebpackAssetsManifest({
          output: "asset-manifest.json",
          entrypoints: true,
          integrity: true,
          customize(entry, _original, manifest) {
            if (
              manifest.utils.isKeyValuePair(entry) &&
              entry.key === "typography.css"
            ) {
              return { ...entry, key: "assets/css/typography.css" };
            }

            return entry;
          },
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
        // Each config needs a unique chunk loading name to avoid collisions.
        chunkLoadingGlobal: "coralEmbedWebpackJsonp",
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
            templateContent: fs.readFileSync(paths.appEmbedHTML, "utf8"),
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "story.html",
            templateContent: fs.readFileSync(paths.appEmbedStoryHTML, "utf8"),
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "storyButton.html",
            templateContent: fs.readFileSync(
              paths.appEmbedStoryButtonHTML,
              "utf8"
            ),
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "amp.html",
            templateContent: fs.readFileSync(paths.appEmbedAMPHTML, "utf8"),
            inject: "head",
          }),
          new HtmlWebpackPlugin({
            filename: "storyAMP.html",
            templateContent: fs.readFileSync(
              paths.appEmbedStoryAMPHTML,
              "utf8"
            ),
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
        // Each config needs a unique chunk loading name to avoid collisions.
        chunkLoadingGlobal: "coralCountWebpackJsonp",
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
            templateContent: fs.readFileSync(paths.appCountHTML, "utf8"),
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
        // Each config needs a unique chunk loading name to avoid collisions.
        chunkLoadingGlobal: "coralFrameWebpackJsonp",
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
    /* Webpack config for oembed */
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
      entry: [paths.appOEmbedIndex],
      output: {
        ...baseConfig.output,
        // Each config needs a unique chunk loading name to avoid collisions.
        chunkLoadingGlobal: "coralCommentEmbedWebpackJsonp",
        // don't hash the count, cache-busting must be completed by the requester
        // as this lives in a static template on the embed site.
        filename: "assets/js/commentEmbed.js",
      },
      plugins: filterPlugins([
        ...baseConfig.plugins!,
        ...ifWatch(
          // Generates a `commentEmbed.html` file with the <script> injected.
          new HtmlWebpackPlugin({
            filename: "commentEmbed.html",
            templateContent: fs.readFileSync(paths.appCommentEmbedHTML, "utf8"),
            inject: "body",
          })
        ),
        new WebpackAssetsManifest({
          output: "oembed-asset-manifest.json",
          entrypoints: true,
          integrity: true,
        }),
      ]),
    },
  ];
}
