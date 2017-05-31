import {ADD_EXTERNAL_CONFIG} from '../constants/config';
import {handleAuthToken} from 'coral-framework/actions/auth';

export const addExternalConfig = (config) => {

  /**
   * If an authToken is present and not falsey, handle it.
   *
   * This allows the host page to pass in an authToken in order to control
   * the Talk session.
   */
  if (config.authToken) {
    handleAuthToken(config.authToken);
  }

  return {
    type: ADD_EXTERNAL_CONFIG,
    config
  };
};
