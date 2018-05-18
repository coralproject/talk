import { handlePopupAuth } from 'plugin-api/beta/client/utils';

export const loginWithGoogle = () => (dispatch, _, { rest }) => {
  handlePopupAuth(`${rest.uri}/auth/google`);
};
