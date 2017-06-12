const wrapResponse = require('../../../graph/helpers/response');
const {SEARCH_OTHER_USERS} = require('../../../perms/constants');

function getReactionConfig(reaction) {
  const Reaction = reaction.charAt(0).toUpperCase() + reaction.slice(1);
  const REACTION = reaction.toUpperCase();
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

      # The ${reaction} that was created.
      ${reaction}: ${Reaction}Action

      # An array of errors relating to the mutation that occurred.
      errors: [UserError!]
    }

    type RootMutation {

      # Creates a ${reaction} on an entity.
      create${Reaction}Action(input: Create${Reaction}ActionInput!): Create${Reaction}ActionResponse
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
    resolvers: {
      Subscription: {
        [`${reaction}ActionCreated`]: ({action}) => {
          return action;
        },
        [`${reaction}ActionDeleted`]: ({action}) => {
          return action;
        },
      },
      [`${Reaction}Action`]: {

        // This will load the user for the specific action. We'll limit this to the
        // admin users only or the current logged in user.
        user({user_id}, _, {loaders: {Users}, user}) {
          if (user && (user.can(SEARCH_OTHER_USERS) || user_id === user.id)) {
            return Users.getByID.load(user_id);
          }
        }
      },
      RootMutation: {
        [`create${Reaction}Action`]: (_, {input: {item_id}}, {mutators: {Action}, pubsub, loaders: {Comments}}) => {
          const response = Comments.get.load(item_id).then((comment) => {
            return Action.create({item_id, item_type: 'COMMENTS', action_type: REACTION})
              .then((action) => {
                pubsub.publish(`${reaction}ActionCreated`, {action, comment});
                return Promise.resolve(action);
              });
          });
          return wrapResponse(reaction)(response);
        },
        [`delete${Reaction}Action`]: (_, {input: {id}}, {mutators: {Action}, pubsub, loaders: {Comments}}) => {
          const response = Action.delete({id})
            .then((action) => {
              return Comments.get.load(action.item_id).then((comment) => {
                pubsub.publish(`${reaction}ActionDeleted`, {action, comment});
                return Promise.resolve(action);
              });
            });
          return wrapResponse(reaction)(response);
        }
      },
    },
    hooks: {
      Action: {
        __resolveType: {
          post({action_type}) {
            switch (action_type) {
            case REACTION:
              return `${Reaction}Action`;
            }
          }
        }
      },
      ActionSummary: {
        __resolveType: {
          post({action_type}) {
            switch (action_type) {
            case REACTION:
              return `${Reaction}ActionSummary`;
            }
          }
        }
      }
    },
    setupFunctions: {
      [`${reaction}ActionCreated`]: (options, args) => ({
        [`${reaction}ActionCreated`]: {
          filter: ({comment}) => comment.asset_id === args.asset_id,
        },
      }),
      [`${reaction}ActionDeleted`]: (options, args) => ({
        [`${reaction}ActionDeleted`]: {
          filter: ({comment}) => comment.asset_id === args.asset_id,
        },
      }),
    },
  };
}

module.exports = getReactionConfig;
