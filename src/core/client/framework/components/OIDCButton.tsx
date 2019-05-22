import React from "react";
import { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button } from "coral-ui/components";

import styles from "./OIDCButton.css";

interface Props {
  onClick: PropTypesOf<typeof Button>["onClick"];
  children: React.ReactNode;
}

const OIDCButton: FunctionComponent<Props> = props => (
  <Button
    classes={styles}
    variant="filled"
    size="large"
    fullWidth
    onClick={props.onClick}
  >
    <span>{props.children}</span>
  </Button>
);

export default OIDCButton;
