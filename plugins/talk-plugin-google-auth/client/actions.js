export const loginWithGoogle = () => (dispatch, _, { rest }) => {
  window.open(
    `${rest.uri}/auth/google`,
    'Continue with Google',
    'menubar=0,resizable=0,width=500,height=500,top=200,left=500'
  );
};
