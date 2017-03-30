module.exports = `
  enum ACTION_TYPE {
  
    # Represents a Respect.
    RESPECT
  }
  
  input CreateRespectInput {
  
    # The item's id for which we are to create a respect.
    item_id: ID!
  
    # The type of the item for which we are to create the respect.
    item_type: ACTION_ITEM_TYPE!
  }
  
  # RespectAction is used by users who "respect" a specific entity.
  type RespectAction implements Action {

    # The ID of the action.
    id: ID!
  
    # The author of the action.
    user: User
  
    # The time when the Action was updated.
    updated_at: Date
  
    # The time when the Action was created.
    created_at: Date
  }

  type RespectActionSummary implements ActionSummary {

    # The count of actions with this group.
    count: Int

    # The current user's action.
    current_user: RespectAction
  }
  
  type CreateRespectResponse implements Response {
  
    # The respect that was created.
    respect: RespectAction
  
    # An array of errors relating to the mutation that occurred.
    errors: [UserError]
  }

  type RootMutation {
  
    # Creates a respect on an entity.
    createRespect(respect: CreateRespectInput!): CreateRespectResponse
  }
`;
