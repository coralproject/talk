const _ = require('lodash');
const debug = require('debug')('talk:graph:resolvers');

const ActionSummary = require('./action_summary');
const Action = require('./action');
const AssetActionSummary = require('./asset_action_summary');
const Asset = require('./asset');
const CommentStatusHistory = require('./comment_status_history');
const Comment = require('./comment');
const Cursor = require('./cursor');
const Date = require('./date');
const FlagActionSummary = require('./flag_action_summary');
const FlagAction = require('./flag_action');
const DontAgreeAction = require('./dont_agree_action');
const DontAgreeActionSummary = require('./dont_agree_action_summary');
const GenericUserError = require('./generic_user_error');
const RootMutation = require('./root_mutation');
const RootQuery = require('./root_query');
const Settings = require('./settings');
const Subscription = require('./subscription');
const TagLink = require('./tag_link');
const Tag = require('./tag');
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
  CommentStatusHistory,
  Comment,
  Cursor,
  Date,
  FlagActionSummary,
  FlagAction,
  DontAgreeAction,
  DontAgreeActionSummary,
  GenericUserError,
  RootMutation,
  RootQuery,
  Settings,
  Subscription,
  TagLink,
  Tag,
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
  debug(`added plugin '${plugin.name}'`);

  return _.merge(acc, resolvers);
}, resolvers);

module.exports = resolvers;
