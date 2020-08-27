import cn from "classnames";
import React from "react";

import { BaseButton } from "coral-ui/components/v2";

import styles from "./RTEButton.css";

const RTEButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function RTEButtonForwarded(props, ref) {
  return (
    <BaseButton
      {...props}
      className={cn(styles.button, props.className)}
      ref={ref}
    />
  );
});

export default RTEButton;
