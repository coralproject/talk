import cn from "classnames";
import React, { ButtonHTMLAttributes, FunctionComponent, Ref } from "react";

import { BaseButton, Icon } from "coral-ui/components/v2";
import { withForwardRef } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./TooltipButton.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  className?: string;
  toggleVisibility: () => void;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

const TooltipButton: FunctionComponent<Props> = ({
  active,
  className,
  toggleVisibility,
  forwardRef,
}) => (
  <BaseButton
    className={cn(styles.button, className)}
    onClick={evt => {
      evt.stopPropagation();
      toggleVisibility();
    }}
    ref={forwardRef}
  >
    <Icon color={active ? "primary" : "inherit"}>info</Icon>
  </BaseButton>
);

const enhanced = withForwardRef(TooltipButton);
export type TooltipButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
