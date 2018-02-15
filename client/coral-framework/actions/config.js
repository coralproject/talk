import { MERGE_CONFIG } from '../constants/config';

export const mergeConfig = config => ({
  type: MERGE_CONFIG,
  config,
});
