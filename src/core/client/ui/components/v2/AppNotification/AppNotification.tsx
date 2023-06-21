import cn from "classnames";
import React, { ComponentType, FunctionComponent } from "react";

import { ButtonSvgIcon, CloseIcon, SvgIcon } from "coral-ui/components/icons";
import { Button, Flex } from "coral-ui/components/v2";

import styles from "./AppNotification.css";

interface Props {
  Icon?: ComponentType;
  onClose?: () => void;
  color?: "success" | "alert" | "mono";
  children?: React.ReactNode;
}

const AppNotification: FunctionComponent<Props> = ({
  Icon,
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
          {Icon && <SvgIcon Icon={Icon} className={styles.icon} />}
          {children}
        </Flex>
        {onClose && (
          <Button variant="text" color="mono" onClick={onClose}>
            <ButtonSvgIcon Icon={CloseIcon} size="xs" />
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
