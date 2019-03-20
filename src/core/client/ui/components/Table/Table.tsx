import cn from "classnames";
import React, { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

import styles from "./Table.css";

interface Props extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;

  fullWidth?: boolean;
}

const Table: StatelessComponent<Props> = ({
  classes,
  className,
  fullWidth,
  children,
  ...rest
}) => {
  const rootClassName = cn(classes.root, className, {
    [classes.fullWidth]: fullWidth,
  });
  return (
    <table className={rootClassName} {...rest}>
      {children}
    </table>
  );
};

const enhanced = withStyles(styles)(Table);
export default enhanced;
