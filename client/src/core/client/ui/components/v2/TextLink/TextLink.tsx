import cn from "classnames";
import React, { AnchorHTMLAttributes, FunctionComponent } from "react";

import { ShareExternalLinkIcon, SvgIcon } from "coral-ui/components/icons";
import { withStyles } from "coral-ui/hocs";

import styles from "./TextLink.css";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: typeof styles;
}

const TextLinkProps: FunctionComponent<Props> = (props) => {
  const { className, children, classes, ...rest } = props;

  const rootClassName = cn(classes.root, className);

  return (
    <a
      className={rootClassName}
      href={props.href || (children as string)}
      {...rest}
    >
      {children}
      {props.target === "_blank" && (
        <SvgIcon
          className={classes.icon}
          size="xs"
          Icon={ShareExternalLinkIcon}
        />
      )}
    </a>
  );
};

const enhanced = withStyles(styles)(TextLinkProps);
export default enhanced;
