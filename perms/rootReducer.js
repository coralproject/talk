module.exports = (user /* , perm*/) => {

  // this runs before everything
  if (
    user.status === 'BANNED' ||
    (user.suspension.until && user.suspension.until > new Date())
  ) {
    return false;
  }
};
