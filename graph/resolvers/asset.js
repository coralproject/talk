const Asset = {
  comments({id}, _, {loaders}) {
    return loaders.Comments.getByAssetID.load(id);
  },
  settings({settings = null}, _, {loaders}) {
    return loaders.Settings.load()
      .then((globalSettings) => {

        if (settings) {
          settings = Object.assign({}, settings, globalSettings);
        } else {
          settings = globalSettings;
        }

        return settings;
      });
  }
};

module.exports = Asset;
