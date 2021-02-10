import React, { FunctionComponent, RefObject } from "react";

import { CardCloseButton, Flex } from "coral-ui/components/v2";

import styles from "./ModalHeader.css";

interface Props {
  onClose: () => void;
  focusableRef?: RefObject<any>;
  children?: React.ReactNode;
}

const ModalHeader: FunctionComponent<Props> = ({
  onClose,
  focusableRef,
  children,
}) => {
  return (
    <div className={styles.root}>
      <Flex justifyContent="space-between" alignItems="flex-start">
        {children}
        <CardCloseButton onClick={onClose} ref={focusableRef} />
      </Flex>
    </div>
  );
};

export default ModalHeader;
