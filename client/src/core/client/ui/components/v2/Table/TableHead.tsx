import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./TableHead.css";

export const TableHeadContext = React.createContext<boolean>(false);

interface Props extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const TableHead: FunctionComponent<Props> = ({
  classes,
  className,
  children,
  ...rest
}) => {
  const rootClassName = cn(classes.root, className);
  return (
    <TableHeadContext.Provider value>
      <thead className={rootClassName} {...rest}>
        {children}
      </thead>
    </TableHeadContext.Provider>
  );
};

const enhanced = withStyles(styles)(TableHead);
export default enhanced;
