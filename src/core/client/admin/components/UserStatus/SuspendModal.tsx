import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { ScaledUnit } from "coral-common/helpers/i18n";
import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

import ChangeStatusModal from "./ChangeStatusModal";
import ChangeStatusModalHeader from "./ChangeStatusModalHeader";
import ModalHeaderUsername from "./ModalHeaderUsername";

import SuspendForm from "./SuspendForm";

import styles from "./SuspendModal.css";

interface Props {
  username: string | null;
  getMessage: GetMessage;
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
  getMessage,
  username,
  success,
  organizationName,
}) => {
  const [successDuration, setSuccessDuration] = useState("");
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
                $username={username}
                strong={<ModalHeaderUsername />}
                $duration={successDuration}
              >
                <ChangeStatusModalHeader>
                  <ModalHeaderUsername>{username}</ModalHeaderUsername> has been
                  suspended for <strong>{successDuration}</strong>
                </ChangeStatusModalHeader>
              </Localized>

              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-suspendModal-success-close">
                  <Button
                    ref={lastFocusableRef}
                    variant="filled"
                    color="default"
                    onClick={onClose}
                  >
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
                strong={<ModalHeaderUsername />}
                $username={username || <NotAvailable />}
              >
                <ChangeStatusModalHeader id="suspendModal-title">
                  Suspend{" "}
                  <ModalHeaderUsername>
                    {username || <NotAvailable />}
                  </ModalHeaderUsername>
                  ?
                </ChangeStatusModalHeader>
              </Localized>
              <Localized id="community-suspendModal-consequence">
                <div className={styles.bodyText}>
                  While suspended, this user will no longer be able to comment,
                  use reactions, or report comments.
                </div>
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

const enhanced = withGetMessage(SuspendModal);

export default enhanced;
