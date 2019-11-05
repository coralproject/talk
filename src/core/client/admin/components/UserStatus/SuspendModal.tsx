import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { ScaledUnit } from "coral-common/helpers/i18n";
import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
} from "coral-ui/components/v2";

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
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="suspendModal-title">
        {({ firstFocusableRef, lastFocusableRef }) => (
          <Card className={styles.card}>
            <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
            {success && (
              <HorizontalGutter spacing={3}>
                <Localized
                  id="community-suspendModal-success"
                  $username={username}
                  strong={<strong />}
                  $duration={successDuration}
                >
                  <h2 className={styles.title}>
                    <strong>{username}</strong> has been suspended for{" "}
                    <strong>{successDuration}</strong>
                  </h2>
                </Localized>

                <Flex justifyContent="flex-end" itemGutter="half">
                  <Localized id="community-suspendModal-success-close">
                    <Button variant="filled" color="default" onClick={onClose}>
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
                  strong={<strong />}
                  $username={username || <NotAvailable />}
                >
                  <h2 className={styles.title} id="suspendModal-title">
                    Suspend <strong>{username || <NotAvailable />}</strong>?
                  </h2>
                </Localized>
                <Localized id="community-suspendModal-consequence">
                  <div className={styles.bodyText}>
                    While suspended, this user will no longer be able to
                    comment, use reactions, or report comments.
                  </div>
                </Localized>

                <SuspendForm
                  username={username}
                  onCancel={onClose}
                  organizationName={organizationName}
                  onSubmit={onFormSubmit}
                />
              </HorizontalGutter>
            )}
          </Card>
        )}
      </Modal>
    </>
  );
};

const enhanced = withGetMessage(SuspendModal);

export default enhanced;
