import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes, Ref } from "react";

import Icon, { IconProps } from "coral-ui/components/v2/Icon";
import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./ButtonIcon.css";

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

export const ButtonIcon: FunctionComponent<Props> = (props) => {
  const { classes, className, forwardRef, ...rest } = props;
  const rootClassName = cn(classes.root, className);
  return <Icon className={rootClassName} {...rest} ref={forwardRef} />;
};

ButtonIcon.defaultProps = {
  size: "sm",
} as Partial<Props>;

const enhanced = withForwardRef(withStyles(styles)(ButtonIcon));
export type ButtonIconProps = PropTypesOf<typeof enhanced>;
export default enhanced;
