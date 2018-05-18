import { handlePopupAuth } from 'plugin-api/beta/client/utils';

export const loginWithFacebook = () => (dispatch, _, { rest }) => {
  handlePopupAuth(`${rest.uri}/auth/facebook`);
};
