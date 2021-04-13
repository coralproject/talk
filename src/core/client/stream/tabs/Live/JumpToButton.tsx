import React, { FunctionComponent } from "react";

import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./JumpToButton.css";

interface Props {
  onClick: () => void;
  children: string | React.ReactNode;
}

const JumpToButton: FunctionComponent<Props> = ({ onClick, children }) => {
  return (
    <div className={styles.jumpToContainer}>
      <Flex justifyContent="center" alignItems="center">
        <Flex alignItems="center">
          <Button
            onClick={onClick}
            color="primary"
            className={styles.jumpButton}
          >
            {children}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default JumpToButton;
