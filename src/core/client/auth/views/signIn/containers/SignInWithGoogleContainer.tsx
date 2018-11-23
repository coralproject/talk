import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import GoogleButton from "talk-auth/components/GoogleButton";

export default class SignInWithGoogleContainer extends Component {
  private handleOnClick = () => {
    return;
  };

  public render() {
    return (
      <Localized id="signIn-signInWithGoogle">
        <GoogleButton onClick={this.handleOnClick}>
          Sign in with Google
        </GoogleButton>
      </Localized>
    );
  }
}
