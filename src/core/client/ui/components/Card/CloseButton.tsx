import React, { Ref } from "react";
import { StatelessComponent } from "react";
import { withForwardRef, withStyles } from "talk-ui/hocs";
import { Omit, PropTypesOf } from "talk-ui/types";

import BaseButton from "../BaseButton";
import Icon from "../Icon";

import styles from "./CloseButton.css";

export interface CloseButtonProps
  extends Omit<PropTypesOf<typeof BaseButton>, "ref"> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles & PropTypesOf<typeof BaseButton>["classes"];

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

const CloseButton: StatelessComponent<CloseButtonProps> = props => {
  const { classes, forwardRef, ...rest } = props;
  return (
    <BaseButton classes={classes} ref={forwardRef} {...rest}>
      <Icon className={classes.icon} size="md">
        close
      </Icon>
    </BaseButton>
  );
};

const enhanced = withForwardRef(withStyles(styles)(CloseButton));
export default enhanced;
