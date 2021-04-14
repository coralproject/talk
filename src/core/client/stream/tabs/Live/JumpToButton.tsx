import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./JumpToButton.css";

interface Props {
  onClick: () => void;
  children: string | React.ReactNode;

  onCancel?: () => void;
}

const JumpToButton: FunctionComponent<Props> = ({
  onClick,
  children,
  onCancel,
}) => {
  return (
    <div className={styles.jumpToContainer}>
      <Flex justifyContent="center" alignItems="center">
        <Flex alignItems="center">
          <Button
            onClick={onClick}
            color="primary"
            className={cn({
              [styles.jumpButton]: !onCancel,
              [styles.jumpToWithCancel]: onCancel,
            })}
          >
            {children}
          </Button>
          {onCancel && (
            <Button
              onClick={onCancel}
              color="primary"
              aria-valuetext="close"
              className={styles.jumpToCancelButton}
            >
              <Icon>close</Icon>
            </Button>
          )}
        </Flex>
      </Flex>
    </div>
  );
};

export default JumpToButton;
