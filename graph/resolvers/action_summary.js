const ActionSummary = {
  action_type({action_type}) {

    // TODO: remove once we cast the data model to have uppercase action
    // types.
    return action_type.toUpperCase();
  },
  item_type({item_type}) {

    // TODO: remove once we cast the data model to have uppercase item
    // types.
    return item_type.toUpperCase();
  }
};

module.exports = ActionSummary;
