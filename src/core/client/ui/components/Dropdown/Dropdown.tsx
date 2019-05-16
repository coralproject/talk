import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Dropdown.css";

interface Props {
  children?: React.ReactNode;
  className?: string;
  classes: typeof styles;
}

const Dropdown: FunctionComponent<Props> = ({
  className,
  children,
  classes,
  ...rest
}) => {
  return (
    <div className={classes.root} {...rest}>
      {children}
    </div>
  );
};

export default withStyles(styles)(Dropdown);
