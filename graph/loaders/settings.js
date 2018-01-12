const SettingsService = require('../../services/settings');
const DataLoader = require('dataloader');

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = () => {
  const loader = new DataLoader(selections =>
    Promise.all(
      selections.map(fields => {
        return SettingsService.retrieve(fields);
      })
    )
  );

  return {
    Settings: {
      load: (fields = false) => loader.load(fields),
    },
  };
};
