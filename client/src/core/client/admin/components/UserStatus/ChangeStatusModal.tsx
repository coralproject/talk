import React, { FunctionComponent, RefObject } from "react";

import {
  Card,
  CardCloseButton,
  Flex,
  Modal,
  ModalProps,
} from "coral-ui/components/v2";

import styles from "./ChangeStatusModal.css";

interface RenderProps {
  lastFocusableRef: RefObject<any>;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactNode;

function isRenderProp(
  children: ModalProps["children"]
): children is RenderPropsCallback {
  return typeof children === "function";
}

interface Props extends Partial<ModalProps> {
  onClose: () => void;
}

const ChangeStatusModal: FunctionComponent<Props> = ({
  children,
  onClose,
  ...rest
}) => {
  return (
    <Modal {...rest} onClose={onClose}>
      {(renderProps) => (
        <Card className={styles.root}>
          <Flex justifyContent="flex-end">
            <CardCloseButton
              onClick={onClose}
              ref={renderProps.firstFocusableRef}
            />
          </Flex>
          {isRenderProp(children)
            ? children.call(null, [renderProps])
            : children}
        </Card>
      )}
    </Modal>
  );
};

export default ChangeStatusModal;
