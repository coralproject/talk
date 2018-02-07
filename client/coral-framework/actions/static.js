import * as actions from '../constants/static';

export const setStaticConfiguration = config => ({
  type: actions.SET_STATIC_CONFIGURATION,
  config,
});
