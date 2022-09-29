import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Button, ButtonIcon, Flex, Icon } from "coral-ui/components/v2";

import styles from "./AppNotification.css";

interface Props {
  icon?: string;
  onClose?: () => void;
  color?: "success" | "alert" | "mono";
  children?: React.ReactNode;
}

const AppNotification: FunctionComponent<Props> = ({
  icon,
  children,
  onClose,
  color,
}) => {
  const rootClassName = cn(styles.root, {
    [styles.success]: color === "success",
  });

  return (
    <div className={rootClassName}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        className={styles.inner}
      >
        <Flex alignItems="center" itemGutter>
          {icon && <Icon>{icon}</Icon>}
          {children}
        </Flex>
        {onClose && (
          <Button variant="text" color="mono" onClick={onClose}>
            <ButtonIcon>close</ButtonIcon>
          </Button>
        )}
      </Flex>
    </div>
  );
};

AppNotification.defaultProps = {
  color: "success",
};

export default AppNotification;
