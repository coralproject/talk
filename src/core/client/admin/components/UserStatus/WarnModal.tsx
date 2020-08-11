import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { HorizontalGutter } from "coral-ui/components/v2";

import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";
import WarnForm from "./WarnForm";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  organizationName: string;
}

const WarnModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  organizationName,
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
      aria-labelledby="warnModal-title"
    >
      {({ lastFocusableRef }) => (
        <>
          <HorizontalGutter spacing={3}>
            <Localized
              id="community-warnModal-areYouSure"
              strong={<ModalHeaderUsername />}
              $username={username || <NotAvailable />}
            >
              <ModalHeader id="WarnModal-title">
                Warn{" "}
                <ModalHeaderUsername>
                  {username || <NotAvailable />}
                </ModalHeaderUsername>
                ?
              </ModalHeader>
            </Localized>
            <Localized id="community-WarnModal-consequence">
              <ModalBodyText>
                While warned, this user will no longer be able to comment, use
                reactions, or report comments until they acknowledge the
                warning.
              </ModalBodyText>
            </Localized>

            <WarnForm
              username={username}
              onCancel={onClose}
              organizationName={organizationName}
              onSubmit={onFormSubmit}
              lastFocusableRef={lastFocusableRef}
            />
          </HorizontalGutter>
        </>
      )}
    </ChangeStatusModal>
  );
};

export default WarnModal;
