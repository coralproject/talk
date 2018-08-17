import cn from "classnames";
import React, { StatelessComponent } from "react";
import { withStyles } from "talk-ui/hocs";
import * as styles from "./Spinner.css";

export interface SpinnerProps {
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const Spinner: StatelessComponent<SpinnerProps> = props => {
  const { className, classes } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <div className={rootClassName}>
      <svg
        className={styles.spinner}
        width="40px"
        height="40px"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={styles.path}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        />
      </svg>
    </div>
  );
};

const enhanced = withStyles(styles)(Spinner);
export default enhanced;
