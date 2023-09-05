import cn from "classnames";
import React, { FunctionComponent, ReactNode, Ref } from "react";

import { withForwardRef, withStyles } from "coral-ui/hocs";

import styles from "./Card.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the component.
   */
  children: ReactNode;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;

  tabIndex?: number;
  forwardRef?: Ref<HTMLDivElement>;
}

const Card: FunctionComponent<CardProps> = (props) => {
  const { className, classes, children, forwardRef, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <div className={rootClassName} {...rest} ref={forwardRef}>
      {children}
    </div>
  );
};

const enhanced = withForwardRef(withStyles(styles)(Card));
export default enhanced;
