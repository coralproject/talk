import cn from "classnames";
import { withForwardRef } from "coral-ui/hocs";
import React, { ComponentType, Ref } from "react";

import styles from "./SvgIcon.css";

export interface SvgIconProps {
  Icon: ComponentType;
  size?: string;
  color?: string;
  strokeWidth?: string;
  filled?: boolean | "primary" | "primaryLight";
  className?: string;
  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  Icon,
  size = "sm",
  color = "inherit",
  strokeWidth = "regular",
  filled = false,
  className,
  forwardRef,
  ...rest
}) => {
  let sizeStyle;
  switch (size) {
    case "xxs":
      sizeStyle = styles.xxs;
      break;
    case "xs":
      sizeStyle = styles.xs;
      break;
    case "sm":
      sizeStyle = styles.sm;
      break;
    case "md":
      sizeStyle = styles.md;
      break;
    case "lg":
      sizeStyle = styles.lg;
      break;
    case "xl":
      sizeStyle = styles.xl;
  }

  let colorStyle;
  switch (color) {
    case "stream":
      colorStyle = styles.colorStream;
      break;
    case "primary":
      colorStyle = styles.colorPrimary;
      break;
    case "primaryLight":
      colorStyle = styles.colorPrimaryLight;
      break;
    case "error":
      colorStyle = styles.colorError;
      break;
    case "success":
      colorStyle = styles.colorSuccess;
  }

  let strokeWidthStyle;
  switch (strokeWidth) {
    case "regular":
      strokeWidthStyle = styles.strokeWidthRegular;
      break;
    case "bold":
      strokeWidthStyle = styles.strokeWidthBold;
      break;
    case "semibold":
      strokeWidthStyle = styles.strokeWidthSemiBold;
  }

  let fillStyle;
  switch (filled) {
    case false:
      fillStyle = styles.noFill;
      break;
    case true:
      fillStyle = styles.filled;
      break;
    case "primary":
      fillStyle = styles.primaryFill;
      break;
    case "primaryLight":
      fillStyle = styles.primaryLightFill;
      break;
  }

  const spanClassNames = cn(
    styles.root,
    sizeStyle,
    className,
    colorStyle,
    strokeWidthStyle,
    fillStyle
  );
  return (
    <span className={spanClassNames} {...rest} ref={forwardRef}>
      <Icon />
    </span>
  );
};

const enhanced = withForwardRef(SvgIcon);
export default enhanced;
