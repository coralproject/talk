import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button } from "talk-ui/components";

interface Props {
  onClick: React.EventHandler<React.MouseEvent>;
}

const SignOutButton: StatelessComponent<Props> = props => (
  <Localized id="general-signOutButton">
    <Button onClick={props.onClick}>Sign Out</Button>
  </Localized>
);

export default SignOutButton;
