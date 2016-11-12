import React from 'react';

const SignIn = ({openSignInDialog, children}) => (
  <div>
    <Button onClick={openSignInDialog}>
      Sign in to comment
    </Button>
    {children}
  </div>
);

export default SignIn;
