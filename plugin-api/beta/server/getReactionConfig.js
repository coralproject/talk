const { SEARCH_OTHER_USERS } = require('../../../perms/constants');
const errors = require('../../../errors');
const pluralize = require('pluralize');
const sc = require('snake-case');
const CommentModel = require('../../../models/comment');
const { CREATE_MONGO_INDEXES } = require('../../../config');

function getReactionConfig(reaction) {
  reaction = reaction.toLowerCase();

  if (CREATE_MONGO_INDEXES) {
    // Create the index on the comment model based on the reaction config.
    CommentModel.collection.createIndex(
      {
        created_at: 1,
        [`action_counts.${sc(reaction)}`]: 1,
      },
      {
        background: true,
      }
    );
  }

  const reactionPlural = pluralize(reaction);
  const Reaction = reaction.charAt(0).toUpperCase() + reaction.slice(1);
  const REACTION = reaction.toUpperCase();
  const REACTION_PLURAL = reactionPlural.toUpperCase();
  const typeDefs = `
    enum ACTION_TYPE {

      # Represents a ${Reaction}.
      ${REACTION}
    }

    enum ASSET_METRICS_SORT {

      # Represents a ${Reaction}Action.
      ${REACTION}
    }

    input Create${Reaction}ActionInput {

      # The item's id for which we are to create a ${reaction}.
      item_id: ID!
    }

    enum SORT_COMMENTS_BY {

      # Comments will be sorted by their count of ${reactionPlural}
      # on the comment.
      ${REACTION_PLURAL}
    }

    input Delete${Reaction}ActionInput {

      # The item's id for which we are deleting a ${reaction}.
      id: ID!
    }

    # ${Reaction}Action is used by users who "${reaction}" a specific entity.
    type ${Reaction}Action implements Action {

      # The ID of the action.
      id: ID!

      # The author of the action.
      user: User

      # The time when the Action was updated.
      updated_at: Date

      # The time when the Action was created.
      created_at: Date

      # The item's id for which the Action was created.
      item_id: ID!
    }

    type ${Reaction}ActionSummary implements ActionSummary {

      # The count of actions with this group.
      count: Int

      # The current user's action.
      current_user: ${Reaction}Action
    }

    # A summary of counts related to all the ${Reaction}s on an Asset.
    type ${Reaction}AssetActionSummary implements AssetActionSummary {

      # Number of ${reaction}s associated with actionable types on this this Asset.
      actionCount: Int

      # Number of unique actionable types that are referenced by the ${reaction}s.
      actionableItemCount: Int
    }

    type Create${Reaction}ActionResponse implements Response {

      # The ${reaction} that was created.
      ${reaction}: ${Reaction}Action

      # An array of errors relating to the mutation that occurred.
      errors: [UserError!]
    }

    type Delete${Reaction}ActionResponse implements Response {
      # An array of errors relating to the mutation that occurred.
      errors: [UserError!]
    }

    type RootMutation {

      # Creates a ${reaction} on an entity.
      create${Reaction}Action(input: Create${Reaction}ActionInput!): Create${Reaction}ActionResponse!
      delete${Reaction}Action(input: Delete${Reaction}ActionInput!): Delete${Reaction}ActionResponse
    }

    type Subscription {

      # Subscribe to ${reaction}s.
      ${reaction}ActionCreated(asset_id: ID!): ${Reaction}Action

      # Subscribe to ${reaction} removals.
      ${reaction}ActionDeleted(asset_id: ID!): ${Reaction}Action
    }
  `;

  return {
    typeDefs,
    schemas: ({ CommentSchema }) => {
      CommentSchema.index(
        {
          created_at: 1,
          [`action_counts.${sc(reaction)}`]: 1,
        },
        {
          background: true,
        }
      );
    },
    context: {
      Sort: () => ({
        Comments: {
          [reactionPlural]: {
            startCursor(ctx, nodes, { cursor }) {
              // The cursor is the start! This is using numeric pagination.
              return cursor != null ? cursor : 0;
            },
            endCursor(ctx, nodes, { cursor }) {
              return nodes.length
                ? (cursor != null ? cursor : 0) + nodes.length
                : null;
            },
            sort(ctx, query, { cursor, sortOrder }) {
              if (cursor) {
                query = query.skip(cursor);
              }

              return query.sort({
                [`action_counts.${reaction}`]: sortOrder === 'DESC' ? -1 : 1,
                created_at: sortOrder === 'DESC' ? -1 : 1,
              });
            },
          },
        },
      }),
    },
    resolvers: {
      Subscription: {
        [`${reaction}ActionCreated`]: ({ action }) => {
          return action;
        },
        [`${reaction}ActionDeleted`]: ({ action }) => {
          return action;
        },
      },
      [`${Reaction}Action`]: {
        // This will load the user for the specific action. We'll limit this to the
        // admin users only or the current logged in user.
        user({ user_id }, _, { loaders: { Users }, user }) {
          if (user && (user.can(SEARCH_OTHER_USERS) || user_id === user.id)) {
            return Users.getByID.load(user_id);
          }
        },
      },
      RootMutation: {
        [`create${Reaction}Action`]: async (
          _,
          { input: { item_id } },
          { mutators: { Action }, pubsub, loaders: { Comments } }
        ) => {
          const comment = await Comments.get.load(item_id);
          if (!comment) {
            throw errors.ErrNotFound;
          }

          try {
            const action = await Action.create({
              item_id,
              item_type: 'COMMENTS',
              action_type: REACTION,
            });

            if (pubsub) {
              // The comment is needed to allow better filtering e.g. by asset_id.
              pubsub.publish(`${reaction}ActionCreated`, { action, comment });
            }

            return {
              [reaction]: action,
            };
          } catch (err) {
            if (err instanceof errors.ErrAlreadyExists) {
              return err.metadata.existing;
            }

            throw err;
          }
        },
        [`delete${Reaction}Action`]: async (
          _,
          { input: { id } },
          { mutators: { Action }, pubsub, loaders: { Comments } }
        ) => {
          const action = await Action.delete({ id });
          if (!action) {
            return null;
          }

          const comment = await Comments.get.load(action.item_id);
          if (pubsub) {
            // The comment is needed to allow better filtering e.g. by asset_id.
            pubsub.publish(`${reaction}ActionDeleted`, { action, comment });
          }
        },
      },
    },
    hooks: {
      Action: {
        __resolveType: {
          post({ action_type }) {
            switch (action_type) {
              case REACTION:
                return `${Reaction}Action`;
              default:
                return undefined;
            }
          },
        },
      },
      ActionSummary: {
        __resolveType: {
          post({ action_type }) {
            switch (action_type) {
              case REACTION:
                return `${Reaction}ActionSummary`;
              default:
                return undefined;
            }
          },
        },
      },
    },
    setupFunctions: {
      [`${reaction}ActionCreated`]: (options, args) => ({
        [`${reaction}ActionCreated`]: {
          filter: ({ comment }) => comment.asset_id === args.asset_id,
        },
      }),
      [`${reaction}ActionDeleted`]: (options, args) => ({
        [`${reaction}ActionDeleted`]: {
          filter: ({ comment }) => comment.asset_id === args.asset_id,
        },
      }),
    },
  };
}

module.exports = getReactionConfig;
