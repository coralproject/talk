import cn from "classnames";
import React, { FunctionComponent, Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { Spacing } from "coral-ui/theme/sharedVariables";
import { PropTypesOf } from "coral-ui/types";

/** Needs to be loaded after styles, because Box styles have priority */
import Box from "../Box";

import styles from "./HorizontalGutter.css";

interface Props extends Omit<PropTypesOf<typeof Box>, "ref"> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  /** @deprecated use `spacing` instead */
  size?: "half" | "full" | "double" | "triple" | "oneAndAHalf";

  /** Choose gutter size, uses predefined sizes from design tokens */
  spacing?: Spacing | 0;

  /** The name of the HorizontalGutter to render */
  children?: React.ReactNode;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLDivElement>;

  /**
   * The container used for the root node.
   * Either a string to use a DOM element, a component, or an element.
   * By default, it maps the variant to a good default headline component.
   */
  container?: React.ReactElement<any> | React.ComponentType<any> | string;
}

const HorizontalGutter: FunctionComponent<Props> = (props) => {
  const { classes, className, size, forwardRef, container, spacing, ...rest } =
    props;
  const spacingClass = spacing ? (classes as any)[`spacing-${spacing}`] : "";
  const rootClassName = cn(
    classes.root,
    className,
    spacing !== undefined ? spacingClass : classes[size!]
  );

  const innerProps = {
    className: rootClassName,
    ref: forwardRef,
    container,
    ...rest,
  };
  return <Box {...innerProps} />;
};

HorizontalGutter.defaultProps = {
  size: "full",
  container: "div",
} as Partial<Props>;

const enhanced = withForwardRef(withStyles(styles)(HorizontalGutter));
export type HorizontalGutterProps = PropTypesOf<typeof enhanced>;
export default enhanced;
