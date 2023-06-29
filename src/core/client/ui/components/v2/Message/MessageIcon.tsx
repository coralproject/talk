import cn from "classnames";
import React, {
  ComponentType,
  FunctionComponent,
  HTMLAttributes,
  Ref,
} from "react";

import { SvgIcon } from "coral-ui/components/icons";
import { withForwardRef, withStyles } from "coral-ui/hocs";

import styles from "./MessageIcon.css";

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  size?: "xs" | "sm" | "md" | "lg" | "xl";

  Icon: ComponentType;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

export const MessageIcon: FunctionComponent<Props> = (props) => {
  const { classes, className, forwardRef, Icon, ...rest } = props;
  const rootClassName = cn(classes.root, className);
  return (
    <SvgIcon Icon={Icon} className={rootClassName} {...rest} ref={forwardRef} />
  );
};

MessageIcon.defaultProps = {
  size: "sm",
};

const enhanced = withForwardRef(withStyles(styles)(MessageIcon));
export default enhanced;
