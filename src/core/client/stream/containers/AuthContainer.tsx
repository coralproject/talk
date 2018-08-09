import * as React from "react";

import Auth from "../components/Auth";

class AuthContainer extends React.Component {
  public state = {
    open: false,
    focus: false,
  };

  public openPopup = () => {
    this.setState({
      open: true,
    });
  };

  public closePopup = () => {
    this.setState({
      open: false,
    });
  };

  public setFocus = (focus: boolean) => {
    this.setState({
      focus,
    });
  };

  public render() {
    const { open, focus } = this.state;
    return (
      <Auth
        open={open}
        focus={focus}
        openPopup={this.openPopup}
        closePopup={this.closePopup}
        setFocus={this.setFocus}
      />
    );
  }
}

export default AuthContainer;
