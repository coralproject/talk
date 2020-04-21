import cn from "classnames";
import React, { ButtonHTMLAttributes, FunctionComponent, Ref } from "react";

import { BaseButton, Icon } from "coral-ui/components/v2";
import { withForwardRef } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import { IconColor } from "coral-ui/components/v2/Icon/Icon";

import styles from "./TooltipButton.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  activeColor?: IconColor;
  className?: string;
  classes?: typeof styles;
  toggleVisibility: () => void;
  ariaLabel?: string;
  title?: string;

  /** Internal: Forwarded Ref */
  forwardRef?: Ref<HTMLButtonElement>;
}

const TooltipButton: FunctionComponent<Props> = ({
  active,
  className,
  classes,
  toggleVisibility,
  forwardRef,
  activeColor = "primary",
  ariaLabel,
  title,
}) => (
  <BaseButton
    className={cn(classes ? classes.button : styles.button, className)}
    onClick={(evt) => {
      evt.stopPropagation();
      toggleVisibility();
    }}
    ref={forwardRef}
    aria-label={ariaLabel}
    title={title}
  >
    <Icon color={active ? activeColor : "inherit"}>info</Icon>
  </BaseButton>
);

const enhanced = withForwardRef(TooltipButton);
export type TooltipButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
