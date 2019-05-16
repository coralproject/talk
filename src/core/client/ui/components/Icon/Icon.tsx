import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes, Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./Icon.css";

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
  color?: "inherit" | "primary" | "error" | "success";

  /** The name of the icon to render */
  children: string;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

const Icon: FunctionComponent<Props> = props => {
  const { classes, className, size, color, forwardRef, ...rest } = props;

  const rootClassName = cn(
    classes.root,
    classes[size!],
    {
      [classes.colorPrimary]: color === "primary",
      [classes.colorError]: color === "error",
      [classes.colorSuccess]: color === "success",
    },
    className
  );
  return (
    <span
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
