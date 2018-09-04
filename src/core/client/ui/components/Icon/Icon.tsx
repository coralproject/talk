import cn from "classnames";
import React, { HTMLAttributes, Ref, StatelessComponent } from "react";

import { withForwardRef, withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import * as styles from "./Icon.css";

interface InnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  size?: "sm" | "md" | "lg" | "xl";

  /** The name of the icon to render */
  children: string;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

const Icon: StatelessComponent<InnerProps> = props => {
  const { classes, className, size, forwardRef, ...rest } = props;
  const rootClassName = cn(classes.root, className, classes[size!]);
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
};

const enhanced = withForwardRef(withStyles(styles)(Icon));
export type IconProps = PropTypesOf<typeof enhanced>;
export default enhanced;
