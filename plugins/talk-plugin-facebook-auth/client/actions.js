export const loginWithFacebook = () => (dispatch, _, { rest }) => {
  window.open(
    `${rest.uri}/auth/facebook`,
    'Continue with Facebook',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};
