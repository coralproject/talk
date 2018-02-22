export const loginWithGoogle = () => (dispatch, _, { rest }) => {
  window.location = `${rest.uri}/auth/google`;
};
