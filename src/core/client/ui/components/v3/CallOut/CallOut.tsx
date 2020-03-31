import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

import { BaseButton, Icon } from "coral-ui/components/v2";
import { withStyles } from "coral-ui/hocs";

import styles from "./CallOut.css";

type CallOutColor = "mono" | "success" | "alert" | "none";

interface Props {
  children?: any;
  color?: CallOutColor;
  className?: string;
  classes: typeof styles;
  visible?: boolean;
  onClose?: () => void;
}

const CallOut: FunctionComponent<Props> = ({
  color = "mono",
  classes,
  className,
  children,
  visible = true,
  onClose,
}) => {
  if (!visible) {
    return null;
  }

  const rootClasses = cn(
    classes.root,
    {
      [classes.mono]: color === "mono",
      [classes.success]: color === "success",
      [classes.alert]: color === "alert",
    },
    className
  );

  const onCloseClicked = useCallback(() => {
    if (!onClose) {
      return;
    }

    onClose();
  }, [onClose]);

  return (
    <div className={rootClasses}>
      <div className={classes.content}>{children}</div>
      <BaseButton className={classes.closeButton} onClick={onCloseClicked}>
        <Icon size="sm">close</Icon>
      </BaseButton>
    </div>
  );
};

const enhanced = withStyles(styles)(CallOut);

export default enhanced;
