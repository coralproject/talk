const UserError = {
  __resolveType({ field_name }) {
    if (field_name) {
      return 'ValidationUserError';
    }

    return 'GenericUserError';
  },
};

module.exports = UserError;
