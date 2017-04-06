const _ = require('lodash');
const Joi = require('joi');
const debug = require('debug')('talk:graph:resolvers');

const ActionSummary = require('./action_summary');
const Action = require('./action');
const AssetActionSummary = require('./asset_action_summary');
const Asset = require('./asset');
const Comment = require('./comment');
const Date = require('./date');
const FlagActionSummary = require('./flag_action_summary');
const FlagAction = require('./flag_action');
const DontAgreeAction = require('./dont_agree_action');
const DontAgreeActionSummary = require('./dont_agree_action_summary');
const GenericUserError = require('./generic_user_error');
const LikeAction = require('./like_action');
const RootMutation = require('./root_mutation');
const RootQuery = require('./root_query');
const Settings = require('./settings');
const UserError = require('./user_error');
const User = require('./user');
const ValidationUserError = require('./validation_user_error');

const plugins = require('../../services/plugins');

// Provide the core resolvers.
let resolvers = {
  ActionSummary,
  Action,
  AssetActionSummary,
  Asset,
  Comment,
  Date,
  FlagActionSummary,
  FlagAction,
  DontAgreeAction,
  DontAgreeActionSummary,
  GenericUserError,
  LikeAction,
  RootMutation,
  RootQuery,
  Settings,
  UserError,
  User,
  ValidationUserError,
};

/**
 * Plugin support requires that we merge in existing resolvers with our new
 * plugin based ones. This allows plugins to extend existing resolvers as well
 * as provide new ones.
 */
resolvers = plugins.get('server', 'resolvers').reduce((acc, {plugin, resolvers}) => {
  Joi.assert(resolvers, Joi.object().pattern(/\w/, Joi.object().pattern(/\w/, Joi.func())), `Plugin '${plugin.name}' had an error loading the resolvers`);

  debug(`added plugin '${plugin.name}'`);

  return _.merge(acc, resolvers);
}, resolvers);

module.exports = resolvers;
