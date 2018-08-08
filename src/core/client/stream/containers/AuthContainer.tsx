import * as React from "react";

import Auth from "../components/Auth";

class AuthContainer extends React.Component {
  state = {
    open: false,
    focus: false,
  };

  openPopup = () => {
    this.setState({
      open: true,
    });
  };

  closePopup = () => {
    this.setState({
      open: false,
    });
  };

  setFocus = (focus: boolean) => {
    this.setState({
      focus,
    });
  };

  render() {
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
