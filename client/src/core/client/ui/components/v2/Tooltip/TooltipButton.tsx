import cn from "classnames";
import React, { ButtonHTMLAttributes, FunctionComponent, Ref } from "react";

import { InformationCircleIcon, SvgIcon } from "coral-ui/components/icons";
import Button from "coral-ui/components/v3/Button";
import { withForwardRef } from "coral-ui/hocs";
import { PropTypesOf } from "coral-ui/types";

import styles from "./TooltipButton.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  activeColor?: PropTypesOf<typeof Button>["color"];
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
  <Button
    className={cn(classes ? classes.button : styles.button, className)}
    onClick={(evt) => {
      evt.stopPropagation();
      toggleVisibility();
    }}
    ref={forwardRef}
    aria-label={ariaLabel}
    title={title}
    color={active ? activeColor : "none"}
    variant="flat"
    paddingSize="none"
  >
    <SvgIcon Icon={InformationCircleIcon} />
  </Button>
);

const enhanced = withForwardRef(TooltipButton);
export type TooltipButtonProps = PropTypesOf<typeof enhanced>;
export default enhanced;
