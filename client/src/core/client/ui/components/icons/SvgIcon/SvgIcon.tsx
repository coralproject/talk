import cn from "classnames";
import { withForwardRef } from "coral-ui/hocs";
import React, { ComponentType, Ref } from "react";

import styles from "./SvgIcon.css";

export interface SvgIconProps {
  Icon: ComponentType;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  color?: "stream" | "teal" | "tealLight" | "error" | "success";
  strokeWidth?: "thin" | "regular" | "bold" | "semibold";
  filled?: "none" | "currentColor" | "teal" | "tealLight";
  className?: string;
  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLSpanElement>;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  Icon,
  size = "sm",
  color = "inherit",
  strokeWidth = "regular",
  filled = "none",
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
    case "teal":
      colorStyle = styles.colorTeal;
      break;
    case "tealLight":
      colorStyle = styles.colorTealLight;
      break;
    case "error":
      colorStyle = styles.colorError;
      break;
    case "success":
      colorStyle = styles.colorSuccess;
  }

  let strokeWidthStyle;
  switch (strokeWidth) {
    case "thin":
      strokeWidthStyle = styles.strokeWidthThin;
      break;
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
    case "none":
      fillStyle = styles.noFill;
      break;
    case "currentColor":
      fillStyle = styles.filled;
      break;
    case "teal":
      fillStyle = styles.tealFill;
      break;
    case "tealLight":
      fillStyle = styles.tealLightFill;
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
