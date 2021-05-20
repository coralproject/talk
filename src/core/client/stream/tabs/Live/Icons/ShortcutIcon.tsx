import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";

import styles from "./ShortcutIcon.css";

interface Props {
  className?: string;
  ariaLabel?: string;
}

const ShortcutIcon: FunctionComponent<Props> = ({ className, ariaLabel }) => {
  return (
    <Icon className={cn(styles.icon, className)} aria-label={ariaLabel}>
      keyboard_return
    </Icon>
  );
};

export default ShortcutIcon;
