const _ = require('lodash');
const debug = require('debug')('talk:graph:resolvers');

const Action = require('./action');
const ActionSummary = require('./action_summary');
const Asset = require('./asset');
const AssetActionSummary = require('./asset_action_summary');
const BannedStatusHistory = require('./banned_status_history');
const Comment = require('./comment');
const CommentStatusHistory = require('./comment_status_history');
const Cursor = require('./cursor');
const Date = require('./date');
const DontAgreeAction = require('./dont_agree_action');
const DontAgreeActionSummary = require('./dont_agree_action_summary');
const FlagAction = require('./flag_action');
const FlagActionSummary = require('./flag_action_summary');
const GenericUserError = require('./generic_user_error');
const RootMutation = require('./root_mutation');
const RootQuery = require('./root_query');
const Settings = require('./settings');
const Subscription = require('./subscription');
const SuspensionStatusHistory = require('./suspension_status_history');
const Tag = require('./tag');
const TagLink = require('./tag_link');
const User = require('./user');
const UserError = require('./user_error');
const UserState = require('./user_state');
const UsernameStatusHistory = require('./username_status_history');
const ValidationUserError = require('./validation_user_error');

const plugins = require('../../services/plugins');

// Provide the core resolvers.
let resolvers = {
  Action,
  ActionSummary,
  Asset,
  AssetActionSummary,
  BannedStatusHistory,
  Comment,
  CommentStatusHistory,
  Cursor,
  Date,
  DontAgreeAction,
  DontAgreeActionSummary,
  FlagAction,
  FlagActionSummary,
  GenericUserError,
  RootMutation,
  RootQuery,
  Settings,
  Subscription,
  SuspensionStatusHistory,
  Tag,
  TagLink,
  User,
  UserError,
  UserState,
  UsernameStatusHistory,
  ValidationUserError,
};

/**
 * Plugin support requires that we merge in existing resolvers with our new
 * plugin based ones. This allows plugins to extend existing resolvers as well
 * as provide new ones.
 */
resolvers = plugins
  .get('server', 'resolvers')
  .reduce((acc, { plugin, resolvers }) => {
    debug(`added plugin '${plugin.name}'`);

    return _.merge(acc, resolvers);
  }, resolvers);

module.exports = resolvers;
