const wrapResponse = require('../../../graph/helpers/response');

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

    input Create${Reaction}Input {

        # The item's id for which we are to create a ${reaction}.
        item_id: ID!

        # The type of the item for which we are to create the ${reaction}.
        item_type: ACTION_ITEM_TYPE!
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

    type Create${Reaction}Response implements Response {

        # The ${reaction} that was created.
        ${reaction}: ${Reaction}Action

        # An array of errors relating to the mutation that occurred.
        errors: [UserError!]
    }

    type RootMutation {

        # Creates a ${reaction} on an entity.
        create${Reaction}(${reaction}: Create${Reaction}Input!): Create${Reaction}Response
    }
  `;

  return {
    typeDefs,
    resolvers: {
      RootMutation: {
        [`create${Reaction}`]: (_, {[reaction]: {item_id, item_type}}, {mutators: {Action}}) => {
          return wrapResponse(reaction)(Action.create({item_id, item_type, action_type: REACTION}));
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
    }
  };
}

module.exports = getReactionConfig;
