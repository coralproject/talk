const TagLink = {
  assigned_by({assigned_by}, _, {user, loaders: {Users}}) {
    if (user && user.hasRole('ADMIN')) {
      return Users.getByID.load(assigned_by);
    }
  }
};

module.exports = TagLink;
