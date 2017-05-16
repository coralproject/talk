module.exports = {
  reducer: function (perm, user, context, initialState) {

    // this runs before everything
    if (user.status === 'BANNED') {
      return false;
    }

    return initialState;
  }
};
