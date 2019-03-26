import cn from "classnames";
import React, { StatelessComponent, useContext } from "react";

import { withStyles } from "talk-ui/hocs";

import { TableHeadContext } from "./TableHead";

import styles from "./TableRow.css";

interface Props extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const TableRow: StatelessComponent<Props> = ({
  classes,
  className,
  children,
  ...rest
}) => {
  const inTableHead = useContext(TableHeadContext);
  const rootClassName = cn(classes.root, className, {
    [classes.body]: !inTableHead,
  });
  return (
    <tr className={rootClassName} {...rest}>
      {children}
    </tr>
  );
};

const enhanced = withStyles(styles)(TableRow);
export default enhanced;
