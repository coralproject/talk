import cn from "classnames";
import React, { AnchorHTMLAttributes, StatelessComponent } from "react";

import { withStyles } from "talk-ui/hocs";

import styles from "./TextLink.css";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const TextLinkProps: StatelessComponent<Props> = props => {
  const { className, children, classes, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <a
      className={rootClassName}
      href={props.href || (children as string)}
      {...rest}
    >
      {children}
    </a>
  );
};

const enhanced = withStyles(styles)(TextLinkProps);
export default enhanced;
