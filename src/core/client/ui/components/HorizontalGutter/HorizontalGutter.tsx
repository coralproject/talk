import cn from "classnames";
import React, { HTMLAttributes, Ref, StatelessComponent } from "react";

import { withForwardRef, withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import styles from "./HorizontalGutter.css";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  size?: "half" | "full" | "double" | "triple" | "oneAndAHalf";

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

const HorizontalGutter: StatelessComponent<Props> = props => {
  const { classes, className, size, forwardRef, container, ...rest } = props;
  const rootClassName = cn(classes.root, className, classes[size!]);

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
