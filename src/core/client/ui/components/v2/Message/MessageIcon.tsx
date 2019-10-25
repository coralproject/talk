import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes, Ref } from "react";

import Icon, { IconProps } from "coral-ui/components/Icon";
import { withForwardRef, withStyles } from "coral-ui/hocs";
import { Omit } from "coral-ui/types";

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

export const MessageIcon: FunctionComponent<Props> = props => {
  const { classes, className, forwardRef, ...rest } = props;
  const rootClassName = cn(classes.root, className);
  return <Icon className={rootClassName} {...rest} ref={forwardRef} />;
};

MessageIcon.defaultProps = {
  size: "sm",
};

const enhanced = withForwardRef(withStyles(styles)(MessageIcon));
export default enhanced;
