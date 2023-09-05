import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Spinner.css";

type Size = "xs" | "sm" | "md";

export interface SpinnerProps {
  /**
   * Convenient prop to override the root styling.
   */
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;

  size?: Size;
}

function calculateSize(size: Size): number {
  switch (size) {
    case "xs":
      return 15;
    case "sm":
      return 30;
    case "md":
      return 40;
    default:
      throw new Error(`Unknown ${size}`);
  }
}

const Spinner: FunctionComponent<SpinnerProps> = (props) => {
  const { className, classes } = props;

  const rootClassName = cn(classes.spinner, className);
  const s = calculateSize(props.size!);

  return (
    <svg
      className={rootClassName}
      width={`${s}px`}
      height={`${s}px`}
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
  );
};

Spinner.defaultProps = {
  size: "md",
};

const enhanced = withStyles(styles)(Spinner);
export default enhanced;
