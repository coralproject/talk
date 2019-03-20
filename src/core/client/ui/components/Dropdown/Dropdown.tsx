import React, { StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

import styles from "./Dropdown.css";

interface Props {
  children?: React.ReactNode;
  className?: string;
  classes: typeof styles;
}

const Dropdown: StatelessComponent<Props> = ({
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
