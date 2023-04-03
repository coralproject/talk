import cn from "classnames";
import React, { ComponentType } from "react";

import styles from "./SvgIcon.css";

interface SvgIconProps {
  Icon: ComponentType;
  size?: string;
  color?: string;
  strokeWidth?: string;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  Icon,
  size = "sm",
  color = "inherit",
  strokeWidth = "regular",
  className,
}) => {
  let sizeStyle;
  switch (size) {
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
  }

  const spanClassNames = cn(
    styles.root,
    sizeStyle,
    className,
    colorStyle,
    strokeWidthStyle
  );
  return (
    <span className={spanClassNames}>
      <Icon />
    </span>
  );
};

export default SvgIcon;
