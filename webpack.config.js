const path = require('path');
const fs = require('fs');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const _ = require('lodash');
const Copy = require('copy-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const debug = require('debug')('talk:webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

// Needed to enforce stable asset hashes.
// https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
const NameAllModulesPlugin = require('name-all-modules-plugin');

// Possibly load the config from the .env file (if there is one).
require('dotenv').config();

const { plugins, pluginsPath, PluginManager } = require('./plugins');
const manager = new PluginManager(plugins);
const targetPlugins = manager.section('targets').plugins;
const clientPlugins = manager.section('client').plugins;

debug(`Using ${pluginsPath} as the plugin configuration path`);

const buildTargets = [
  'coral-admin',
  'coral-login',
  { name: 'coral-auth-callback', disablePolyfill: true },
];

const buildEmbeds = ['stream'];

// In production, default turn off source maps. In development, default use
// 'cheap-module-source-map'.
const DEFAULT_WEBPACK_SOURCE_MAP =
  process.env.NODE_ENV === 'production' ? 'none' : 'cheap-module-source-map';

// TALK_WEBPACK_SOURCE_MAP is sourced from the environment, defaulting based on
// the environment.
const TALK_WEBPACK_SOURCE_MAP = _.get(
  process.env,
  'TALK_WEBPACK_SOURCE_MAP',
  DEFAULT_WEBPACK_SOURCE_MAP
);

// Set the devtool based on the source map selection, 'none' just means turn off
// source maps.
const devtool =
  TALK_WEBPACK_SOURCE_MAP === 'none' ? false : TALK_WEBPACK_SOURCE_MAP;

// Exclude everything from node_modules except for those that may be in a
// plugin folder inside the node_modules folder.
const exclude = {
  and: [
    // Exclude everything inside node_modules..
    /node_modules/,
    // But not those that contain plugins.
    {
      not: clientPlugins.map(({ name }) => new RegExp(`node_modules\/${name}`)),
    },
  ],
};

//==============================================================================
// Base Webpack Config
//==============================================================================

const config = {
  devtool,
  target: 'web',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
  },
  module: {
    rules: [
      {
        loader: 'plugins-loader',
        test: /\.(json|js)$/,
        include: pluginsPath,
      },
      {
        loader: 'babel-loader',
        exclude,
        test: /\.js$/,
        query: {
          cacheDirectory: true,
        },
      },
      {
        loader: 'hjson-loader',
        test: /\.(json|yml)$/,
        exclude,
      },
      {
        loader: 'yaml-loader',
        exclude,
        test: /\.yml$/,
      },
      {
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            'postcss-loader',
          ],
        }),
        test: /.css$/,
      },
      {
        loader: 'file-loader',
        test: /\.(jpg|png|gif|svg)$/,
      },
      {
        loader: 'url-loader',
        options: { limit: 100000 },
        test: /\.woff$/,
      },
      {
        test: /\.(graphql|gql)$/,
        exclude,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      // Use contenthash instead of chunk hash see
      // https://survivejs.com/webpack/optimizing/adding-hashes-to-filenames/#setting-up-hashing
      filename: getPath => getPath('[name].[contenthash].css'),
    }),
    new Copy([
      ...buildEmbeds.map(embed => ({
        from: path.join(__dirname, 'client', `coral-embed-${embed}`, 'style'),
        to: path.join(__dirname, 'dist', 'embed', embed, '[name].[hash].[ext]'),
      })),
    ]),
    autoprefixer,
    precss,
    new webpack.ProvidePlugin({
      fetch:
        'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: `"${require('./package.json').version}"`,
        NODE_ENV: `${JSON.stringify(process.env.NODE_ENV)}`,
        TALK_DEFAULT_LAZY_RENDER: `${JSON.stringify(
          process.env.TALK_DEFAULT_LAZY_RENDER
        )}`,
      },
    }),
    new webpack.EnvironmentPlugin({
      TALK_PLUGINS_JSON: '{}',
      TALK_THREADING_LEVEL: '3',
      TALK_ADDTL_COMMENTS_ON_LOAD_MORE: '10',
      TALK_ASSET_COMMENTS_LOAD_DEPTH: '10',
      TALK_ADDTL_REPLIES_ON_LOAD_MORE: '999999',
      TALK_REPLY_COMMENTS_LOAD_DEPTH: '3',
      TALK_DEFAULT_STREAM_TAB: 'all',
      TALK_DEFAULT_LANG: 'en',
      TALK_WHITELISTED_LANGUAGES: '',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // We follow this article for stable hashes.
    // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    //
    // Chunks without names do not seem to work, so
    // we have to make sure they are always named.
    // https://github.com/webpack/webpack/tree/master/examples/code-splitting-specify-chunk-name
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new NameAllModulesPlugin(),
  ],
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'client/coral-framework/loaders'),
    ],
  },
  resolve: {
    alias: {
      'graphql-anywhere': path.resolve(
        __dirname,
        'client/coral-framework/graphql/anywhere'
      ),
      'plugin-api': path.resolve(__dirname, 'plugin-api/'),
      plugins: path.resolve(__dirname, 'plugins/'),
      pluginsConfig: pluginsPath,
      lodash: path.resolve(
        __dirname,
        path.resolve(__dirname, 'node_modules/lodash-es')
      ),
      'lodash.isequal': path.resolve(
        __dirname,
        'node_modules/lodash-es/isEqual'
      ),
    },
    modules: [
      path.resolve(__dirname, 'plugins'),
      path.resolve(__dirname, 'client'),
      ...buildTargets.map(target => {
        if (typeof target !== 'string') {
          target = target.name;
        }

        return path.join(__dirname, 'client', target, 'src');
      }),

      ...buildEmbeds.map(embed =>
        path.join(__dirname, 'client', `coral-embed-${embed}`, 'src')
      ),
      'node_modules',
    ],
  },
};

//==============================================================================
// Production configuration overrides
//==============================================================================

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // Pulled from https://slack.engineering/keep-webpack-fast-a-field-guide-for-better-build-performance-f56a5995e8f1
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          arrows: false,
          booleans: false,
          collapse_vars: false,
          comparisons: false,
          computed_props: false,
          hoist_funs: false,
          hoist_props: false,
          hoist_vars: false,
          if_return: false,
          inline: false,
          join_vars: false,
          keep_infinity: true,
          loops: false,
          negate_iife: false,
          properties: false,
          reduce_funcs: false,
          reduce_vars: false,
          sequences: false,
          side_effects: false,
          switches: false,
          top_retain: false,
          toplevel: false,
          typeofs: false,
          unused: false,
          // Switch off all types of compression except those needed to convince
          // react-devtools that we're using a production build
          conditionals: true,
          dead_code: true,
          evaluate: true,
          // Remove warnings + discard any console.* functions
          warnings: false,
          drop_console: true,
        },
        mangle: true,
      },
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      asset: '[path].gz[query]',
      test: /\.(js|css)$/,
    }),
    new CompressionPlugin({
      algorithm: 'deflate',
      asset: '[path].zz[query]',
      test: /\.(js|css)$/,
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      threshold: 10240,
      test: /\.(js|css)$/,
    })
  );
}

//==============================================================================
// Entries
//==============================================================================

function customizeConcatArrays(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

// Applies the base configuration to the following entries.
const applyConfig = (entries, root = {}) =>
  _.mergeWith(
    {},
    config,
    {
      entry: entries.reduce(
        (
          entry,
          {
            name,
            path: modulePath,
            disablePolyfill = false,
            disableWebpackGlobals = false,
          }
        ) => {
          // Create all the entries to be added to the final build target.
          const entries = [];

          if (!disablePolyfill) {
            entries.push('babel-polyfill');
          }

          if (!disableWebpackGlobals) {
            entries.push(
              path.join(
                __dirname,
                'client/coral-framework/helpers/webpackGlobals'
              )
            );
          }

          entries.push(modulePath);

          entry[name] = entries;

          return entry;
        },
        {}
      ),
    },
    root,
    customizeConcatArrays
  );

// Hack until this issue is resolved https://github.com/webpack-contrib/copy-webpack-plugin/issues/104
const copyWebpackPluginManifestHack = file => {
  // Remove hash in manifest key
  file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
  return file;
};

module.exports = [
  // Coral Embed
  applyConfig(
    [
      // Load in the root embed.
      {
        name: 'embed',
        path: path.join(__dirname, 'client/coral-embed/src/index'),
        disablePolyfill: true,
        disableWebpackGlobals: true,
      },
    ],
    {
      output: {
        library: 'Coral',
        // don't hash the embed, cache-busting must be completed by the requester
        // as this lives in a static template on the embed site.
        filename: '[name].js',
      },
      plugins: [
        new ManifestPlugin({
          fileName: 'manifest.embed.json',
          map: copyWebpackPluginManifestHack,
        }),
      ],
    }
  ),

  // All framework targets/embeds/plugins.
  applyConfig(
    [
      // Load in all the targets.
      ...buildTargets.map(target => {
        let disablePolyfill = false;
        if (typeof target !== 'string') {
          disablePolyfill = target.disablePolyfill;
          target = target.name;
        }

        return {
          name: `${target}/bundle`,
          path: path.join(__dirname, 'client/', target, '/src/index'),
          disablePolyfill,
        };
      }),

      // Load in all the embeds.
      ...buildEmbeds.map(embed => ({
        name: `embed/${embed}/bundle`,
        path: path.join(
          __dirname,
          'client/',
          `coral-embed-${embed}`,
          '/src/index'
        ),
      })),

      // Load in all the plugin entries.
      ...targetPlugins.reduce((entries, plugin) => {
        // Introspect the path to find a targets folder.
        let folder = path.dirname(plugin.path);
        let files = fs.readdirSync(folder);

        // While the folder does not contain the targets folder...
        while (!files.includes('targets')) {
          // Try to go up a folder.
          folder = path.normalize(path.join(folder, '..'));

          // And as long as we haven't gone too high
          if (
            !(
              folder.includes(path.join(__dirname, 'node_modules')) ||
              !folder.includes(path.join(__dirname, 'plugins'))
            )
          ) {
            throw new Error(
              `target plugin ${plugin.name} does not have a 'targets' folder`
            );
          }

          files = fs.readdirSync(folder);
        }

        // List all targets available in that folder.
        folder = path.join(folder, 'targets');

        let targets = fs.readdirSync(folder);
        if (targets.length === 0) {
          throw new Error(
            `target plugin ${
              plugin.name
            } has no targets in it's target folder ${folder}`
          );
        }

        return entries.concat(
          targets.map(target => ({
            name: `plugin/${plugin.name}/${target}/bundle`,
            path: path.join(folder, target, 'index'),
          }))
        );
      }, []),
    ],
    {
      plugins: [
        new ManifestPlugin({
          fileName: 'manifest.json',
          map: copyWebpackPluginManifestHack,
        }),
      ],
    }
  ),
];
