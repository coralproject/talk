import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, Icon } from "coral-ui/components/v2";

import styles from "./AppNotification.css";

interface Props {
  icon?: string;
  onClose?: () => void;
  color?: "success" | "alert" | "mono";
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
      <Flex justifyContent="space-between">
        <Flex>
          {icon && <Icon>{icon}</Icon>}
          {children}
        </Flex>
        <Icon>close</Icon>
      </Flex>
    </div>
  );
};

AppNotification.defaultProps = {
  color: "success",
};

export default AppNotification;
