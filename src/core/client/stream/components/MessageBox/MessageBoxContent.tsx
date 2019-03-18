import cn from "classnames";
import React, { StatelessComponent } from "react";

import { Markdown } from "talk-framework/components";
import { withStyles } from "talk-ui/hocs";

import styles from "./MessageBoxContent.css";

interface Props {
  /**
   * The content of the component.
   */
  children: string;
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const MessageBox: StatelessComponent<Props> = props => {
  const { className, classes, children, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <Markdown className={rootClassName} {...rest}>
      {children}
    </Markdown>
  );
};

const enhanced = withStyles(styles)(MessageBox);
export default enhanced;
