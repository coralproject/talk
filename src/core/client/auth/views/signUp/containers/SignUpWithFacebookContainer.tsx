import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import FacebookButton from "talk-auth/components/FacebookButton";

export default class SignUpWithFacebookContainer extends Component {
  private handleOnClick = () => {
    return;
  };

  public render() {
    return (
      <Localized id="signUp-signUpWithFacebook">
        <FacebookButton onClick={this.handleOnClick}>
          Sign up with Facebook
        </FacebookButton>
      </Localized>
    );
  }
}
