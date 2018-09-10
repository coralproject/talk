import cn from "classnames";
import React, { HTMLAttributes, Ref, StatelessComponent } from "react";

import { withForwardRef, withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import * as styles from "./HorizontalGutter.css";

interface InnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  size?: "half" | "full" | "double";

  /** The name of the HorizontalGutter to render */
  children?: React.ReactNode;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLDivElement>;
}

const HorizontalGutter: StatelessComponent<InnerProps> = props => {
  const { classes, className, size, forwardRef, ...rest } = props;
  const rootClassName = cn(classes.root, className, classes[size!]);
  return <div className={rootClassName} {...rest} ref={forwardRef} />;
};

HorizontalGutter.defaultProps = {
  size: "full",
} as Partial<InnerProps>;

const enhanced = withForwardRef(withStyles(styles)(HorizontalGutter));
export type HorizontalGutterProps = PropTypesOf<typeof enhanced>;
export default enhanced;
