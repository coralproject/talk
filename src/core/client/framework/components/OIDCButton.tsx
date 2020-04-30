import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button } from "coral-ui/components/v3";

import styles from "./OIDCButton.css";

interface Props {
  onClick: PropTypesOf<typeof Button>["onClick"];
  children: React.ReactNode;
}

const OIDCButton: FunctionComponent<Props> = (props) => (
  <Button
    className={styles.button}
    variant="filled"
    color="none"
    textSize="small"
    marginSize="small"
    upperCase
    fullWidth
    textAlign="center"
    onClick={props.onClick}
  >
    <span>{props.children}</span>
  </Button>
);

export default OIDCButton;
