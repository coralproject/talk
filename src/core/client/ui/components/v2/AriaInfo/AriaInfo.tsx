import cn from "classnames";
import React, { AllHTMLAttributes, FunctionComponent, Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./AriaInfo.css";

interface Props extends AllHTMLAttributes<HTMLElement> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;
  component?: string;
  children: React.ReactNode;
  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLElement>;
}

const AriaInfo: FunctionComponent<Props> = (props) => {
  const { component, className, classes, forwardRef: ref, ...rest } = props;
  const Component: React.ComponentType<
    React.HTMLAttributes<HTMLElement> & React.ClassAttributes<HTMLElement>
  > = component! as any;
  const rootClassName = cn(classes.root, className);
  return <Component className={rootClassName} {...rest} ref={ref} />;
};

AriaInfo.defaultProps = {
  component: "div",
};

const enhanced = withForwardRef(withStyles(styles)(AriaInfo));
export type AriaInfoProps = PropTypesOf<typeof enhanced>;
export default enhanced;
