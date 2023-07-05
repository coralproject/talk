import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import useCommonTranslation, {
  COMMON_TRANSLATION,
} from "coral-admin/helpers/useCommonTranslation";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

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
  success: boolean;
}

const WarnModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  success,
}) => {
  const notAvailableTranslation = useCommonTranslation(
    COMMON_TRANSLATION.NOT_AVAILABLE
  );
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
          {success && (
            <HorizontalGutter spacing={3}>
              <Localized
                id="community-warnModal-success"
                vars={{ username: username || notAvailableTranslation }}
                elems={{ strong: <ModalHeaderUsername /> }}
              >
                <ModalHeader>
                  A warning has been sent to{" "}
                  <ModalHeaderUsername>{username}</ModalHeaderUsername>
                </ModalHeader>
              </Localized>

              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-suspendModal-success-close">
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
                id="community-warnModal-areYouSure"
                elems={{ strong: <ModalHeaderUsername /> }}
                vars={{ username: username || notAvailableTranslation }}
              >
                <ModalHeader id="warnModal-title">
                  Warn{" "}
                  <ModalHeaderUsername>
                    {username || <NotAvailable />}
                  </ModalHeaderUsername>
                  ?
                </ModalHeader>
              </Localized>
              <Localized id="community-warnModal-consequence">
                <ModalBodyText>
                  A warning can improve a commenter’s conduct without a
                  suspension or ban. The user must acknowledge the warning
                  before they can continue commenting.
                </ModalBodyText>
              </Localized>

              <WarnForm
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

export default WarnModal;
