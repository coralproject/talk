import {ADD_EXTERNAL_CONFIG} from '../constants/config';
import {handleAuthToken} from 'coral-framework/actions/auth';

export const addExternalConfig = (config) => {

  /**
   * If an auth_token is present and not falsey, handle it.
   *
   * This allows the host page to pass in an auth_token in order to control
   * the Talk session.
   */
  if (config.auth_token) {
    handleAuthToken(config.auth_token);
  }

  return {
    type: ADD_EXTERNAL_CONFIG,
    config
  };
};
