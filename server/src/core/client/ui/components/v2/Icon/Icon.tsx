import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes, Ref } from "react";

import CLASSES from "coral-stream/classes";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./Icon.css";

export type IconColor = "inherit" | "primary" | "error" | "success" | "stream";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  size?: "xs" | "sm" | "md" | "lg" | "xl";

  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   */
  color?: IconColor;

  /** The name of the icon to render */
  children: string;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

const Icon: FunctionComponent<Props> = (props) => {
  const { classes, className, size, color, forwardRef, ...rest } = props;

  const rootClassName = cn(
    classes.root,
    classes[size !== undefined ? size : "sm"],
    CLASSES.icon,
    {
      [classes.colorPrimary]: color === "primary",
      [classes.colorError]: color === "error",
      [classes.colorSuccess]: color === "success",
      [classes.colorStream]: color === "stream",
    },
    className
  );
  return (
    <i
      className={rootClassName}
      aria-hidden="true"
      {...rest}
      ref={forwardRef}
    />
  );
};

Icon.defaultProps = {
  size: "sm",
  color: "inherit",
} as Partial<Props>;

const enhanced = withForwardRef(withStyles(styles)(Icon));
export type IconProps = PropTypesOf<typeof enhanced>;
export default enhanced;
