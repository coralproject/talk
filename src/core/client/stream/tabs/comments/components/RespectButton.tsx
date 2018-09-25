import { Localized } from "fluent-react/compat";
import React from "react";

import { Button, ButtonIcon, MatchMedia } from "talk-ui/components";

interface RespectButtonProps {
  onButtonClick: () => {};
}

class RespectButton extends React.Component<RespectButtonProps> {
  public render() {
    return (
      <Button variant="ghost" size="small" onClick={this.props.onButtonClick}>
        <MatchMedia gtWidth="xs">
          <ButtonIcon>thumb_up_alt</ButtonIcon>
        </MatchMedia>
        <Localized id="comments-respectButton-respect">
          <span>Respect</span>
        </Localized>
      </Button>
    );
  }
}

export default RespectButton;
