import * as React from "react";
import { StatelessComponent } from "react";

import { Flex, Button, Popup, Typography } from "talk-ui/components";

interface AuthProps {
  open: boolean;
  focus: boolean;
  openPopup: () => void;
  closePopup: () => void;
  setFocus: (focus: boolean) => void;
}

const Auth: StatelessComponent<AuthProps> = props => {
  return (
    <div>
      <Popup
        href={"/static/js/src-core-client-ui-components-popup-popup.js"}
        title="Coral Project"
        features="menubar=0,resizable=0,width=500,height=550,top=200,left=500"
        open={props.open}
        focus={props.focus}
        onFocus={() => props.setFocus(true)}
        onBlur={() => props.setFocus(false)}
        onClose={props.closePopup}
      />
      <Flex justifyContent="center">
        <Typography>Join the conversation </Typography> |
        <Button color="primary" onClick={props.openPopup} disabled={props.open}>
          Sign In
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={props.openPopup}
          disabled={props.open}
        >
          Register
        </Button>
      </Flex>
    </div>
  );
};

export default Auth;
