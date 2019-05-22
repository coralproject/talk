import cn from "classnames";
import { Icon } from "coral-ui/components";
import React, { AnchorHTMLAttributes, StatelessComponent } from "react";

import { withStyles } from "coral-ui/hocs";

import styles from "./TextLink.css";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** external if set to true will show a little icon that indicates an external link */
  external?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const TextLinkProps: StatelessComponent<Props> = props => {
  const { className, children, classes, external, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <a
      className={rootClassName}
      href={props.href || (children as string)}
      {...rest}
    >
      {children}
      {external && (
        <Icon className={styles.icon} size="xs">
          launch
        </Icon>
      )}
    </a>
  );
};

const enhanced = withStyles(styles)(TextLinkProps);
export default enhanced;
