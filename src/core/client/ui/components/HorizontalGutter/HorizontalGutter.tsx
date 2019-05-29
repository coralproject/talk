import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes, Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./HorizontalGutter.css";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  /** @deprecated use `spacing` instead */
  size?: "half" | "full" | "double" | "triple" | "oneAndAHalf";

  spacing?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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

const HorizontalGutter: FunctionComponent<Props> = props => {
  const {
    classes,
    className,
    size,
    forwardRef,
    container,
    spacing,
    ...rest
  } = props;
  const rootClassName = cn(
    classes.root,
    className,
    spacing ? (classes as any)[`spacing-${spacing!}`] : classes[size!]
  );

  const innerProps = {
    className: rootClassName,
    ref: forwardRef,
    ...rest,
  };

  const Container = container!;

  if (React.isValidElement<any>(Container)) {
    return React.cloneElement(Container, innerProps);
  } else {
    return <Container {...innerProps} />;
  }
};

HorizontalGutter.defaultProps = {
  size: "full",
  container: "div",
} as Partial<Props>;

const enhanced = withForwardRef(withStyles(styles)(HorizontalGutter));
export type HorizontalGutterProps = PropTypesOf<typeof enhanced>;
export default enhanced;
