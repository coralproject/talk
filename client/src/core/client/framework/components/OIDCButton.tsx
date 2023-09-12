import cn from "classnames";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { Button } from "coral-ui/components/v3";

import styles from "./OIDCButton.css";

interface Props {
  onClick: PropTypesOf<typeof Button>["onClick"];
  children: React.ReactNode;
}

const OIDCButton: FunctionComponent<Props> = (props) => (
  <Button
    className={cn(CLASSES.login.oidcButton, styles.button)}
    variant="filled"
    color="none"
    fontSize="small"
    paddingSize="small"
    upperCase
    fullWidth
    textAlign="center"
    onClick={props.onClick}
  >
    <span>{props.children}</span>
  </Button>
);

export default OIDCButton;
