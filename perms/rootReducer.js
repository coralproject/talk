module.exports = {
  checkRoles: function (user, perm, context) {

    // this runs before everything
    if (user.status === 'BANNED') {
      return false;
    }
  }
};
