import cn from "classnames";
import { Icon } from "coral-ui/components";
import React, { AnchorHTMLAttributes, StatelessComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./TextLink.css";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const TextLinkProps: StatelessComponent<Props> = props => {
  const { className, children, classes, target, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <a
      className={rootClassName}
      href={props.href || (children as string)}
      target={target}
      {...rest}
    >
      {children}
      {target === "_blank" && (
        <Icon className={classes.icon} size="xs">
          open_in_new
        </Icon>
      )}
    </a>
  );
};

const enhanced = withStyles(styles)(TextLinkProps);
export default enhanced;
