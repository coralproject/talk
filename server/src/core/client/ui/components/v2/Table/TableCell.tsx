import cn from "classnames";
import React, { FunctionComponent, useContext } from "react";

import { withStyles } from "coral-ui/hocs";

import { TableHeadContext } from "./TableHead";

import styles from "./TableCell.css";

interface Props
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;

  align?: "begin" | "center" | "end";
}

const TableCell: FunctionComponent<Props> = ({
  align,
  classes,
  className,
  children,
  ...rest
}) => {
  const inTableHead = useContext(TableHeadContext);
  const rootClassName = cn(classes.root, className, {
    [classes.header]: inTableHead,
    [classes.body]: !inTableHead,
    [classes.alignCenter]: align === "center",
    [classes.alignEnd]: align === "end",
  });
  const Component = inTableHead ? "th" : "td";
  return (
    <Component className={rootClassName} {...rest}>
      {children}
    </Component>
  );
};

const enhanced = withStyles(styles)(TableCell);
export default enhanced;
