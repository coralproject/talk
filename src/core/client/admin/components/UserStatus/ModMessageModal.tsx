import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";
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
      aria-labelledby="modMessageModal-title"
    >
      {({ lastFocusableRef }) => (
        <>
          {success && (
            <HorizontalGutter spacing={3}>
              <Localized
                id="community-modMessageModal-success"
                elems={{ strong: <ModalHeaderUsername /> }}
                vars={{ username: username ?? "" }}
              >
                <ModalHeader>
                  A message has been sent to{" "}
                  <ModalHeaderUsername>{username}</ModalHeaderUsername>
                </ModalHeader>
              </Localized>

              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-modMessageModal-success-close">
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
                id="community-modMessageModal-areYouSure"
                elems={{
                  strong: <ModalHeaderUsername />,
                }}
                vars={{
                  username: username || <NotAvailable />,
                }}
              >
                <ModalHeader id="modMessageModal-title">
                  Message{" "}
                  <ModalHeaderUsername>
                    {username || <NotAvailable />}
                  </ModalHeaderUsername>
                  ?
                </ModalHeader>
              </Localized>
              <Localized id="community-modMessageModal-consequence">
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
