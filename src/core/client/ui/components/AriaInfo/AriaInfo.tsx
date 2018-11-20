import cn from "classnames";
import React, { AllHTMLAttributes, Ref, StatelessComponent } from "react";

import { withForwardRef, withStyles } from "talk-ui/hocs";
import { PropTypesOf } from "talk-ui/types";

import styles from "./AriaInfo.css";

interface InnerProps extends AllHTMLAttributes<HTMLElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;
  component?: string;
  children: React.ReactNode;
  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

const AriaInfo: StatelessComponent<InnerProps> = props => {
  const { component, className, classes, ...rest } = props;
  const Component = component!;
  const rootClassName = cn(classes.root, className);
  return <Component className={rootClassName} {...rest} />;
};

AriaInfo.defaultProps = {
  component: "div",
};

const enhanced = withForwardRef(withStyles(styles)(AriaInfo));
export type AriaInfoProps = PropTypesOf<typeof enhanced>;
export default enhanced;
