import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./TableBody.css";

interface Props extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const TableBody: FunctionComponent<Props> = ({
  classes,
  className,
  children,
  ...rest
}) => {
  const rootClassName = cn(classes.root, className);
  return (
    <tbody className={rootClassName} {...rest}>
      {children}
    </tbody>
  );
};

const enhanced = withStyles(styles)(TableBody);
export default enhanced;
