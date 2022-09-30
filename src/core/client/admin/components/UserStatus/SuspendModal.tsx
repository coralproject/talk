import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { ScaledUnit } from "coral-common/helpers/i18n";
import { useGetMessage } from "coral-framework/lib/i18n";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

import ModalBodyText from "../ModalBodyText";
import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";
import SuspendForm from "./SuspendForm";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (timeout: number, message: string) => void;
  organizationName: string;
  success: boolean;
}

const SuspendModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  success,
  organizationName,
}) => {
  const [successDuration, setSuccessDuration] = useState("");
  const getMessage = useGetMessage();
  const onFormSubmit = useCallback(
    ({ original, scaled, unit }: ScaledUnit, message: string) => {
      setSuccessDuration(
        getMessage("framework-timeago-time", `${scaled} ${unit}`, {
          value: scaled,
          unit,
        })
      );
      onConfirm(original, message);
    },
    [onConfirm]
  );

  return (
    <ChangeStatusModal
      open={open}
      onClose={onClose}
      aria-labelledby="suspendModal-title"
    >
      {({ lastFocusableRef }) => (
        <>
          {success && (
            <HorizontalGutter spacing={3}>
              <Localized
                id="community-suspendModal-success"
                vars={{
                  username,
                  duration: successDuration,
                }}
                elems={{ strong: <ModalHeaderUsername /> }}
              >
                <ModalHeader>
                  <ModalHeaderUsername>{username}</ModalHeaderUsername> has been
                  suspended for <strong>{successDuration}</strong>
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
                id="community-suspendModal-areYouSure"
                elems={{ strong: <ModalHeaderUsername /> }}
                vars={{ username }}
              >
                <ModalHeader id="suspendModal-title">
                  Suspend{" "}
                  <ModalHeaderUsername>
                    {username || <NotAvailable />}
                  </ModalHeaderUsername>
                  ?
                </ModalHeader>
              </Localized>
              <Localized id="community-suspendModal-consequence">
                <ModalBodyText>
                  While suspended, this user will no longer be able to comment,
                  use reactions, or report comments.
                </ModalBodyText>
              </Localized>

              <SuspendForm
                username={username}
                onCancel={onClose}
                organizationName={organizationName}
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

export default SuspendModal;
