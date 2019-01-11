import React from "react";
import { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { Button } from "talk-ui/components";

import styles from "./OIDCButton.css";

interface Props {
  onClick: PropTypesOf<typeof Button>["onClick"];
  children: React.ReactNode;
}

const OIDCButton: StatelessComponent<Props> = props => (
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
