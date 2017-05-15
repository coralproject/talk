const TagLink = {
  assigned_by({assigned_by}, _, {user, loaders: {Users}}) {
    if (user && user.hasRoles('ADMIN')) {
      return Users.getByID.load(assigned_by);
    }
  }
};

module.exports = TagLink;
