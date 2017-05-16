module.exports = {
  DUMMY_ROLE: 'DUMMY_ROLE',
  checkRoles: function (user, perm) {

    // this runs before everything
    if (user.status === 'BANNED') {
      return false;
    }

    switch (perm) {
    default:
      break;
    }
  }
};
