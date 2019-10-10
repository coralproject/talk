import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { Field, Form } from "react-final-form";

import NotAvailable from "coral-admin/components/NotAvailable";
import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import {
  Button,
  Card,
  CardCloseButton,
  CheckBox,
  Flex,
  HorizontalGutter,
  Modal,
  Typography,
} from "coral-ui/components";

import styles from "./BanModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (message?: string) => void;
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
    ({ emailMessage }) => {
      onConfirm(emailMessage);
    },
    [onConfirm]
  );

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="banModal-title">
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.card}>
          <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
          <HorizontalGutter size="double">
            <HorizontalGutter>
              <Localized
                id="community-banModal-areYouSure"
                strong={<strong />}
                $username={username || <NotAvailable />}
              >
                <Typography variant="header2" id="banModal-title">
                  Are you sure you want to ban{" "}
                  <strong>{username || <NotAvailable />}</strong>?
                </Typography>
              </Localized>
              <Localized id="community-banModal-consequence">
                <Typography>
                  Once banned, this user will no longer be able to comment, use
                  reactions, or report comments.
                </Typography>
              </Localized>
            </HorizontalGutter>
            <Form
              onSubmit={onFormSubmit}
              initialValues={{
                showMessage: false,
                emailMessage: getDefaultMessage,
              }}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <Field name="showMessage">
                    {({ input }) => (
                      <Localized id="community-banModal-customize">
                        <CheckBox {...input} id="banModal-showMessage">
                          Customize ban email message
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
                  <Field name="showMessage" subscription={{ value: true }}>
                    {({ input: { value } }) =>
                      value ? (
                        <Field
                          className={styles.textArea}
                          id="banModal-message"
                          component="textarea"
                          name="emailMessage"
                        />
                      ) : null
                    }
                  </Field>

                  <Flex justifyContent="flex-end" itemGutter="half">
                    <Localized id="community-banModal-cancel">
                      <Button variant="outlined" onClick={onClose}>
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="community-banModal-banUser">
                      <Button
                        variant="filled"
                        color="primary"
                        type="submit"
                        ref={lastFocusableRef}
                      >
                        Ban User
                      </Button>
                    </Localized>
                  </Flex>
                </form>
              )}
            </Form>
          </HorizontalGutter>
        </Card>
      )}
    </Modal>
  );
};

const enhanced = withGetMessage(BanModal);

export default enhanced;
