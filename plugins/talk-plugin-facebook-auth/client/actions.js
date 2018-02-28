export const loginWithFacebook = () => (dispatch, _, { rest }) => {
  window.location = `${rest.uri}/auth/facebook`;
};
