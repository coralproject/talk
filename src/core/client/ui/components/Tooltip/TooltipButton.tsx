import cn from "classnames";
import React, { ButtonHTMLAttributes, FunctionComponent, Ref } from "react";

import { BaseButton, Icon } from "coral-ui/components";
import { withForwardRef } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./TooltipButton.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  className?: string;
  toggleVisibility: () => void;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
  "aria-label": string;
}

const TooltipButton: FunctionComponent<Props> = ({
  active,
  className,
  toggleVisibility,
  forwardRef,
  "aria-label": ariaLabel,
}) => (
  <BaseButton
    className={cn(styles.button, className)}
    onClick={evt => {
      evt.stopPropagation();
      toggleVisibility();
    }}
    aria-label={ariaLabel}
    ref={forwardRef}
  >
    <Icon color={active ? "primary" : "inherit"}>info</Icon>
  </BaseButton>
);

const enhanced = withForwardRef(TooltipButton);
export type TooltipButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
