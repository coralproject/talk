const Asset = {
  comments({id}, _, {loaders}) {
    return loaders.Comments.getByAssetID.load(id);
  },
  settings({settings = null}, _, {loaders}) {
    return loaders.Settings.load()
      .then((globalSettings) => {
        if (settings) {
          settings = Object.assign({}, globalSettings.toObject(), settings);
        } else {
          settings = globalSettings.toObject();
        }
        return settings;
      });
  }
};

module.exports = Asset;
