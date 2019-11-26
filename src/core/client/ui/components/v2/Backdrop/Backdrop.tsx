import cn from "classnames";
import React, { FunctionComponent, HTMLAttributes } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./Backdrop.css";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
  active?: boolean;
}

const Backdrop: FunctionComponent<Props> = ({
  classes,
  active,
  className,
  children,
  ...rest
}) => {
  const rootClassName = cn(
    classes.root,
    {
      [classes.active]: Boolean(active),
    },
    className
  );
  return <div className={rootClassName} {...rest} />;
};

const enhanced = withStyles(styles)(Backdrop);
export default enhanced;
