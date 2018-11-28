import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button } from "talk-ui/components";

import styles from "./SignOutButton.css";

interface Props {
  id?: string;
  onClick: React.EventHandler<React.MouseEvent>;
}

const SignOutButton: StatelessComponent<Props> = props => (
  <Localized id="navigation-signOutButton">
    <Button id={props.id} onClick={props.onClick} className={styles.root}>
      Sign Out
    </Button>
  </Localized>
);

export default SignOutButton;
