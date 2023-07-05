import { InjectedProps } from "@coralproject/rte/lib/factories/createToggle";
import cn from "classnames";
import React from "react";

import { BaseButton } from "coral-ui/components/v2";

import styles from "./RTEButton.css";

const RTEButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & Partial<InjectedProps>
>(function RTEButtonForwarded(props, ref) {
  const { ctrlKey, squire, ButtonComponent, className, rteElementID, ...rest } =
    props;
  return (
    <BaseButton {...rest} className={cn(styles.button, className)} ref={ref} />
  );
});

export default RTEButton;
