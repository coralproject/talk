const debug = require('debug')('talk:graph:connectors');
const merge = require('lodash/merge');

// Config.
const config = require('../config');

// Secrets.
const secrets = require('../secrets');

// Errors.
const errors = require('../errors');

// URLs.
const url = require('../url');

// Graph.
const { getBroker } = require('./subscriptions/broker');
const { getPubsub } = require('./subscriptions/pubsub');
const resolvers = require('./resolvers');
const mutators = require('./mutators');
const loaders = require('./loaders');
const schema = require('./schema');

// Models.
const Action = require('../models/action');
const Asset = require('../models/asset');
const Comment = require('../models/comment');
const User = require('../models/user');

// Services.
const Actions = require('../services/actions');
const Assets = require('../services/assets');
const Cache = require('../services/cache');
const Comments = require('../services/comments');
const DomainList = require('../services/domain_list');
const I18n = require('../services/i18n');
const Jwt = require('../services/jwt');
const Karma = require('../services/karma');
const Kue = require('../services/kue');
const Limit = require('../services/limit');
const Mailer = require('../services/mailer');
const Metadata = require('../services/metadata');
const Migration = require('../services/migration');
const Moderation = require('../services/moderation');
const Mongoose = require('../services/mongoose');
const Passport = require('../services/passport');
const Plugins = require('../services/plugins');
const Redis = require('../services/redis');
const Regex = require('../services/regex');
const Scraper = require('../services/scraper');
const Settings = require('../services/settings');
const Setup = require('../services/setup');
const Subscriptions = require('../services/subscriptions');
const Tags = require('../services/tags');
const Tokens = require('../services/tokens');
const Users = require('../services/users');
const Utils = require('../services/utils');
const Wordlist = require('../services/wordlist');

// Connectors.
const defaultConnectors = {
  errors,
  config,
  secrets,
  url,
  models: {
    Action,
    Asset,
    Comment,
    User,
  },
  services: {
    Actions,
    Assets,
    Cache,
    Comments,
    DomainList,
    I18n,
    Jwt,
    Karma,
    Kue,
    Limit,
    Mailer,
    Metadata,
    Migration,
    Moderation,
    Mongoose,
    Passport,
    Plugins,
    Redis,
    Regex,
    Scraper,
    Settings,
    Setup,
    Subscriptions,
    Tags,
    Tokens,
    Users,
    Utils,
    Wordlist,
  },
  graph: {
    subscriptions: { getBroker, getPubsub },
    resolvers,
    mutators,
    loaders,
    schema,
  },
};

const connectors = Plugins.get('server', 'connectors').reduce(
  (defaultConnectors, { plugin, connectors: pluginConnectors }) => {
    debug(`adding plugin '${plugin.name}'`);

    // Merge in the plugin connectors.
    return merge(defaultConnectors, pluginConnectors);
  },
  defaultConnectors
);

module.exports = connectors;
