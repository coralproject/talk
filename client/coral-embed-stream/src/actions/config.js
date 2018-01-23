import { ADD_EXTERNAL_CONFIG } from '../constants/config';

export const addExternalConfig = config => ({
  type: ADD_EXTERNAL_CONFIG,
  config,
});
