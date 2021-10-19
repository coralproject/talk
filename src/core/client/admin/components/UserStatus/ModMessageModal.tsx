import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

import ChangeStatusModal from "./ChangeStatusModal";
import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ModMessageForm from "./ModMessageForm";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  success: boolean;
}

const ModMessageModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  success,
}) => {
  const onFormSubmit = useCallback(
    (message: string) => {
      onConfirm(message);
    },
    [onConfirm]
  );

  return (
    <ChangeStatusModal
      open={open}
      onClose={onClose}
      // todo: make sure this is connected since just changed
      aria-labelledby="messageModal-title"
    >
      {({ lastFocusableRef }) => (
        <>
          {success && (
            <HorizontalGutter spacing={3}>
              <Localized
                // todo: actually add to translations
                id="community-messageModal-success"
                $username={username}
                strong={<ModalHeaderUsername />}
              >
                <ModalHeader>
                  A message has been sent to{" "}
                  <ModalHeaderUsername>{username}</ModalHeaderUsername>
                </ModalHeader>
              </Localized>

              <Flex justifyContent="flex-end" itemGutter="half">
                {/* todo: actually add to translations */}
                <Localized id="community-messageModal-success-close">
                  <Button ref={lastFocusableRef} onClick={onClose}>
                    Ok
                  </Button>
                </Localized>
              </Flex>
            </HorizontalGutter>
          )}
          {!success && (
            <HorizontalGutter spacing={3}>
              <Localized
                id="community-messageModal-areYouSure"
                strong={<ModalHeaderUsername />}
                $username={username || <NotAvailable />}
              >
                <ModalHeader id="messageModal-title">
                  Message{" "}
                  <ModalHeaderUsername>
                    {username || <NotAvailable />}
                  </ModalHeaderUsername>
                  ?
                </ModalHeader>
              </Localized>
              <Localized id="community-messageModal-consequence">
                <ModalBodyText>
                  Send a message to a commenter that is visible only to them.
                </ModalBodyText>
              </Localized>

              <ModMessageForm
                onCancel={onClose}
                onSubmit={onFormSubmit}
                lastFocusableRef={lastFocusableRef}
              />
            </HorizontalGutter>
          )}
        </>
      )}
    </ChangeStatusModal>
  );
};

export default ModMessageModal;
