import React from 'react';
import Button from './Button';

const SignIn = ({openFacebookWindow, logout}) => (
  <div>
    <Button type="facebook" onClick={openFacebookWindow}>
      Continue with Facebook
    </Button>
    <a onClick={logout}>
      Logout
    </a>
  </div>
);

export default SignIn;
