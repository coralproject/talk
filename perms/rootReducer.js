module.exports = {
  checkRoles: function (user /* , perm*/) {

    // this runs before everything
    if (user.status === 'BANNED') {
      return false;
    }
  }
};
