import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import FacebookButton from "talk-auth/components/FacebookButton";

export default class SignInWithFacebookContainer extends Component {
  private handleOnClick = () => {
    return;
  };

  public render() {
    return (
      <Localized id="signIn-signInWithFacebook">
        <FacebookButton onClick={this.handleOnClick}>
          Sign in with Facebook
        </FacebookButton>
      </Localized>
    );
  }
}
