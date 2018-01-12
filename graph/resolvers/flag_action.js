const FlagAction = {
  // Stored in the metadata, extract and return.
  message({ metadata: { message } }) {
    return message;
  },
  reason({ group_id }) {
    return group_id;
  },
  user({ user_id }, _, { loaders: { Users } }) {
    if (!user_id) {
      return null;
    }

    return Users.getByID.load(user_id);
  },
};

module.exports = FlagAction;
