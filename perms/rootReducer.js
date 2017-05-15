module.exports = {
  constants: [],
  reducer: (perm, user, context, initialState) => {

    // this runs before everything
    if (user.status === 'BANNED') {
      return false;
    }

    return initialState;
  }
};
