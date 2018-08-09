import * as React from "react";
import { StatelessComponent } from "react";
import * as styles from "./Auth.css";

import { Button, Flex, Popup, Typography } from "talk-ui/components";

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
      <Flex itemGutter className={styles.root}>
        <Typography>Join the conversation </Typography>
        <span>|</span>
        <Button
          size="small"
          color="primary"
          variant="underlined"
          onClick={props.openPopup}
          disabled={props.open}
        >
          Sign In
        </Button>
        <Button
          size="small"
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
