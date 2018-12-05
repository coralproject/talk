import cn from "classnames";
import React from "react";
import { ReactNode, StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import styles from "./Card.css";

export interface CardProps {
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
}

const Card: StatelessComponent<CardProps> = props => {
  const { className, classes, children, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <div className={rootClassName} {...rest}>
      {children}
    </div>
  );
};

const enhanced = withStyles(styles)(Card);
export default enhanced;
