import cn from "classnames";
import React, {
  ComponentType,
  FunctionComponent,
  HTMLAttributes,
  Ref,
} from "react";

import { SvgIcon } from "coral-ui/components/icons";
import { withForwardRef, withStyles } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import { SvgIconProps } from "../SvgIcon/SvgIcon";

import styles from "./ButtonSvgIcon.css";

interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /**
   * This prop can be used to add custom classnames.
   * It is handled by the `withStyles `HOC.
   */
  classes: typeof styles;

  size?: SvgIconProps["size"];

  filled?: SvgIconProps["filled"];

  strokeWidth?: SvgIconProps["strokeWidth"];

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;

  Icon: ComponentType;
}

export const ButtonIcon: FunctionComponent<Props> = (props) => {
  const { classes, className, Icon, forwardRef, ...rest } = props;
  const rootClassName = cn(classes.root, className);
  return <SvgIcon className={rootClassName} Icon={Icon} {...rest} />;
};

ButtonIcon.defaultProps = {
  size: "sm",
} as Partial<Props>;

const enhanced = withForwardRef(withStyles(styles)(ButtonIcon));
export type ButtonIconProps = PropTypesOf<typeof enhanced>;
export default enhanced;
