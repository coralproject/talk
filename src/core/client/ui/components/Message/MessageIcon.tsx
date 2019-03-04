import cn from "classnames";
import React, { HTMLAttributes, Ref, StatelessComponent } from "react";

import Icon, { IconProps } from "talk-ui/components/Icon";
import { withForwardRef, withStyles } from "talk-ui/hocs";
import { Omit } from "talk-ui/types";

import styles from "./MessageIcon.css";

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles & IconProps["classes"];

  size?: IconProps["size"];

  /** The name of the icon to render */
  children: string;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

export const MessageIcon: StatelessComponent<Props> = props => {
  const { classes, className, forwardRef, ...rest } = props;
  const rootClassName = cn(classes.root, className);
  return <Icon className={rootClassName} {...rest} ref={forwardRef} />;
};

MessageIcon.defaultProps = {
  size: "sm",
};

const enhanced = withForwardRef(withStyles(styles)(MessageIcon));
export default enhanced;
