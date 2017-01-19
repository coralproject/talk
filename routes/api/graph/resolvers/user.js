const User = {
  actions({id}, _, {loaders}) {
    return loaders.Actions.getByID.load(id);
  }
};

module.exports = User;
