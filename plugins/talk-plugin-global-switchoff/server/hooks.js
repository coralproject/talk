module.exports = {
  RootMutation: {
    updateSettings: {
      async pre(_, { input }) {
        input.metadata = {
          ...input.metadata,
          globalSwitchoffEnable: input.globalSwitchoffEnable,
        };
        delete input.globalSwitchoffEnable;
      },
    },
  },
};
