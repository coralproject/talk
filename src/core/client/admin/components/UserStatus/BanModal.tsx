import { Localized } from "@fluent/react/compat";
import { Formik } from "formik";
import React, { FunctionComponent, useCallback, useMemo } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

import ModalHeader from "../ModalHeader";
import ModalHeaderUsername from "../ModalHeaderUsername";
import ChangeStatusModal from "./ChangeStatusModal";
import { CheckBox } from "./Fields";
import BanMessageField from "./BanMessageField";

import styles from "./BanModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (rejectExistingComments: boolean, message?: string) => void;
  getMessage: GetMessage;
}

const BanModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  getMessage,
}) => {
  const getDefaultMessage = useMemo((): string => {
    return getMessage(
      "common-banEmailTemplate",
      "Someone with access to your account has violated our community guidelines. As a result, your account has been banned. You will no longer be able to comment, react or report comments",
      {
        username,
      }
    );
  }, [getMessage, username]);

  const onFormSubmit = useCallback(
    ({ emailMessage, rejectExistingComments }) => {
      onConfirm(rejectExistingComments, emailMessage);
    },
    [onConfirm]
  );

  return (
    <ChangeStatusModal
      open={open}
      onClose={onClose}
      aria-labelledby="banModal-title"
    >
      {({ lastFocusableRef }) => (
        <HorizontalGutter spacing={3}>
          <HorizontalGutter spacing={2}>
            <Localized
              id="community-banModal-areYouSure"
              strong={<ModalHeaderUsername />}
              username={React.createElement(() => (
                <strong>{username || <NotAvailable />}</strong>
              ))}
            >
              <ModalHeader id="banModal-title">
                Are you sure you want to ban{" "}
                <ModalHeaderUsername>
                  {username || <NotAvailable />}
                </ModalHeaderUsername>
                ?
              </ModalHeader>
            </Localized>
            <Localized id="community-banModal-consequence">
              <p className={styles.bodyText}>
                Once banned, this user will no longer be able to comment, use
                reactions, or report comments.
              </p>
            </Localized>
          </HorizontalGutter>
          <Formik
            onSubmit={onFormSubmit}
            initialValues={{
              showMessage: false,
              rejectExistingComments: false,
              emailMessage: getDefaultMessage,
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter spacing={3}>
                  <Localized id="community-banModal-reject-existing">
                    <CheckBox
                      name="rejectExistingComments"
                      id="banModal-rejectExisting"
                    >
                      Reject all comments by this user
                    </CheckBox>
                  </Localized>
                  <Localized id="community-banModal-customize">
                    <CheckBox name="showMessage" id="banModal-showMessage">
                      Customize ban email message
                    </CheckBox>
                  </Localized>
                  <BanMessageField />
                  <Flex justifyContent="flex-end" itemGutter="half">
                    <Localized id="community-banModal-cancel">
                      <Button variant="flat" onClick={onClose}>
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="community-banModal-banUser">
                      <Button type="submit" ref={lastFocusableRef}>
                        Ban User
                      </Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
              </form>
            )}
          </Formik>
        </HorizontalGutter>
      )}
    </ChangeStatusModal>
  );
};

const enhanced = withGetMessage(BanModal);

export default enhanced;
