const path = require('path');
const fs = require('fs');
const CompressionPlugin = require('compression-webpack-plugin');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const _ = require('lodash');
const Copy = require('copy-webpack-plugin');
const {LicenseWebpackPlugin} = require('license-webpack-plugin');
const webpack = require('webpack');
const debug = require('debug')('talk:webpack');

// Possibly load the config from the .env file (if there is one).
require('dotenv').config();

const {plugins, pluginsPath, PluginManager} = require('./plugins');
const manager = new PluginManager(plugins);
const targetPlugins = manager.section('targets').plugins;

debug(`Using ${pluginsPath} as the plugin configuration path`);

const buildTargets = [
  'coral-admin',
  'coral-docs'
];

const buildEmbeds = [
  'stream'
];

//==============================================================================
// Base Webpack Config
//==============================================================================

const config = {
  devtool: 'cheap-module-source-map',
  target: 'web',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/client/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        loader: 'plugins-loader',
        test: /\.(json|js)$/,
        include: pluginsPath
      },
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/,
        query: {
          cacheDirectory: true
        }
      },
      {
        loader: 'json-loader',
        test: /\.(json|yml)$/,
        exclude: /node_modules/
      },
      {
        loader: 'yaml-loader',
        exclude: /node_modules/,
        test: /\.yml$/,
      },
      {
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader'
        ],
        test: /.css$/,
      },
      {
        loader: 'file-loader',
        test: /\.(jpg|png|gif|svg)$/
      },
      {
        loader: 'url-loader?limit=100000',
        test: /\.woff$/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  plugins: [
    new LicenseWebpackPlugin({
      pattern: /^(MIT|ISC|BSD.*)$/,
      suppressErrors: true,
    }),
    new Copy([
      ...buildEmbeds.map((embed) => ({
        from: path.join(__dirname, 'client', `coral-embed-${embed}`, 'style'),
        to: path.join(__dirname, 'dist', 'embed', embed)
      }))
    ]),
    autoprefixer,
    precss,
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'VERSION': `"${require('./package.json').version}"`,
      }
    }),
    new webpack.EnvironmentPlugin({
      'TALK_PLUGINS_JSON': '{}',
      'TALK_THREADING_LEVEL': '3',
      'TALK_DEFAULT_STREAM_TAB': 'all',
      'TALK_DEFAULT_LANG': 'en'
    })
  ],
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'client/coral-framework/loaders')],
  },
  resolve: {
    alias: {
      'plugin-api': path.resolve(__dirname, 'plugin-api/'),
      plugins: path.resolve(__dirname, 'plugins/'),
      pluginsConfig: pluginsPath
    },
    modules: [
      path.resolve(__dirname, 'plugins'),
      path.resolve(__dirname, 'client'),
      ...buildTargets.map((target) => path.join(__dirname, 'client', target, 'src')),
      ...buildEmbeds.map((embed) => path.join(__dirname, 'client', `coral-embed-${embed}`, 'src')),
      'node_modules'
    ]
  }
};

//==============================================================================
// Production configuration overrides
//==============================================================================

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.(js)$/,
    threshold: 10240,
    minRatio: 0.8
  }));
}

//==============================================================================
// Entries
//==============================================================================

// Applies the base configuration to the following entries.
const applyConfig = (entries, root = {}) => _.merge({}, config, {
  entry: entries.reduce((entry, {name, path, disablePolyfill = false}) => {
    if (disablePolyfill) {
      entry[name] = path;
    } else {
      entry[name] = [
        'babel-polyfill',
        path
      ];
    }

    return entry;
  }, {})
}, root);

module.exports = [

  // Coral Embed
  applyConfig([

    // Load in the root embed.
    {
      name: 'embed',
      path: path.join(__dirname, 'client/coral-embed/src/index'),
      disablePolyfill: process.env.TALK_DISABLE_EMBED_POLYFILL === 'TRUE'
    }

  ], {
    output: {
      library: 'Coral'
    }
  }),

  // All framework targets/embeds/plugins.
  applyConfig([

    // Load in all the targets.
    ...buildTargets.map((target) => ({
      name: `${target}/bundle`,
      path: path.join(__dirname, 'client/', target, '/src/index')
    })),

    // Load in all the embeds.
    ...buildEmbeds.map((embed) => ({
      name: `embed/${embed}/bundle`,
      path: path.join(__dirname, 'client/', `coral-embed-${embed}`, '/src/index')
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
        if (!(folder.includes(path.join(__dirname, 'node_modules')) || !folder.includes(path.join(__dirname, 'plugins')))) {
          throw new Error(`target plugin ${plugin.name} does not have a 'targets' folder`);
        }

        files = fs.readdirSync(folder);
      }

      // List all targets available in that folder.
      folder = path.join(folder, 'targets');

      let targets = fs.readdirSync(folder);
      if (targets.length === 0) {
        throw new Error(`target plugin ${plugin.name} has no targets in it's target folder ${folder}`);
      }

      return entries.concat(targets.map((target) => ({
        name: `plugin/${plugin.name}/${target}/bundle`,
        path: path.join(folder, target, 'index')
      })));
    }, [])
  ])
];
