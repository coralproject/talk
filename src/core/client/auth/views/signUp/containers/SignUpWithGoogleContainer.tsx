import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import GoogleButton from "talk-auth/components/GoogleButton";

export default class SignUpWithGoogleContainer extends Component {
  private handleOnClick = () => {
    return;
  };

  public render() {
    return (
      <Localized id="signUp-signUpWithGoogle">
        <GoogleButton onClick={this.handleOnClick}>
          Sign up with Google
        </GoogleButton>
      </Localized>
    );
  }
}
