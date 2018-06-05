const { ErrNotFound } = require('../../errors');
const { get, merge, isEmpty } = require('lodash');

// Load in the phases to use.
const {
  wordlist,
  commentLength,
  assetClosed,
  commentingDisabled,
  karma,
  staff,
  links,
  premod,
} = require('./phases');

// This phase checks to see if the comment was already prescribed a status. This
// essentially provides a hook for plugins to inject their own comments.
const applyPreexisting = (ctx, comment) => {
  const status = get(comment, 'status');

  // If the status was already defined, don't redefine it. It's only defined
  // when specific external conditions exist, we don't want to override that.
  if (status) {
    return {
      status,
    };
  }
};

// Applies the defaulted status.
const applyStatus = status => () => ({ status });

/**
 * phases is an array of moderation phases carried out in order until a status is
 * returned.
 */
const phases = [
  commentLength,
  assetClosed,
  commentingDisabled,
  wordlist,
  staff,
  links,
  karma,
  applyPreexisting,
  premod,
  applyStatus('NONE'),
];

/**
 * compose will create a moderation pipeline for which is executable with the
 * passed actions.
 *
 * @param {Array} phases the set of moderation phases to pass the comment and
 *                       their options through.
 */
const compose = phases => async (ctx, comment, options) => {
  const actions = get(comment, 'actions', []);

  // Loop over all the moderation phases and see if we've resolved the status.
  for (const phase of phases) {
    const result = await phase(ctx, comment, options);
    if (result) {
      if (result.actions) {
        actions.push(...result.actions);
      }

      // If this result contained a status, then we've finished resolving
      // phases!
      if (result.status) {
        return { status: result.status, actions };
      }
    }
  }
};

/**
 * fetchOptions will generate the options used by the moderation service to
 * determine the end status.
 *
 * @param {Object} ctx graph context
 * @param {Object} comment comment object to use
 */
const fetchOptions = async (ctx, comment) => {
  const {
    loaders: { Settings, Assets },
  } = ctx;

  // Load the settings.
  const settings = await Settings.load();

  // Pull the asset id out of the comment.
  const assetID = get(comment, 'asset_id', null);
  if (assetID === null) {
    // And leave now if this asset wasn't found.
    throw new ErrNotFound();
  }

  // Load the asset.
  const asset = await Assets.getByID.load(assetID);
  if (!asset) {
    // And leave now if this asset wasn't found.
    throw new ErrNotFound();
  }

  // If the asset exists and has settings then return the merged object.
  if (asset && asset.settings && !isEmpty(asset.settings)) {
    asset.settings = merge({}, settings, asset.settings);
  } else {
    asset.settings = settings;
  }

  // Create the options that will be consumed by the phases.
  return {
    asset,
    settings,
  };
};

/**
 * process the comment and return moderation details.
 *
 * @param {Object} ctx graphql context
 * @param {Object} comment comment to perform the moderation phases on
 */
const process = async (ctx, comment) => {
  // Fetch the options to use for the moderation phases.
  const options = await fetchOptions(ctx, comment);

  // Compose a moderation pipeline from the moderation phases and execute it on
  // the comment.
  return compose(phases)(ctx, comment, options);
};

module.exports.process = process;
