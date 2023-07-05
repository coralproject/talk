import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { useNotification } from "coral-admin/App/GlobalNotification";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  Card,
  CardCloseButton,
  Flex,
  FormField,
  HelperText,
  HorizontalGutter,
  Label,
  Modal,
  Option,
  SelectField,
} from "coral-ui/components/v2";
import AppNotification from "coral-ui/components/v2/AppNotification";

import RotateWebhookEndpointSigningSecretMutation from "./RotateWebhookEndpointSigningSecretMutation";

import styles from "./RotateSigningSecretModal.css";

interface Props {
  endpointID: string;
  onHide: () => void;
  open: boolean;
}

const RotateWebhookEndpointSigningSecretModal: FunctionComponent<Props> = ({
  onHide,
  open,
  endpointID,
}) => {
  const { window } = useCoralContext();
  const rotateWebhookEndpointSigningSecret = useMutation(
    RotateWebhookEndpointSigningSecretMutation
  );
  const { setMessage, clearMessage } = useNotification();
  const onRotateSecret = useCallback(
    async ({ inactiveIn }: { inactiveIn: number | string }) => {
      try {
        const inactiveInNum =
          typeof inactiveIn === "number"
            ? inactiveIn
            : parseInt(inactiveIn, 10);
        await rotateWebhookEndpointSigningSecret({
          id: endpointID,
          inactiveIn: inactiveInNum,
        });

        // Post a notification about the successful change.
        setMessage(
          <Localized id="configure-webhooks-rotateSigningSecretSuccessUseNewSecret">
            <AppNotification icon="check_circle_outline" onClose={clearMessage}>
              Webhook endpoint signing secret has been rotated. Please ensure
              you update your integrations to use the new secret below.
            </AppNotification>
          </Localized>
        );

        // Scroll after a zero timeout because chrome won't scroll otherwise.
        setTimeout(() => window.scroll(0, 0), 0);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }

      // Dismiss the modal.
      onHide();

      return;
    },
    [
      clearMessage,
      endpointID,
      onHide,
      rotateWebhookEndpointSigningSecret,
      setMessage,
      window,
    ]
  );

  return (
    <Modal open={open}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
          <Flex justifyContent="flex-end">
            <CardCloseButton onClick={onHide} ref={firstFocusableRef} />
          </Flex>
          <Form onSubmit={onRotateSecret} initialValues={{ inactiveIn: 0 }}>
            {({ handleSubmit, submitting, submitError }) => (
              <form onSubmit={handleSubmit}>
                <HorizontalGutter size="double">
                  <Localized id="configure-webhooks-rotateSigningSecret">
                    <h2 className={styles.title}>Rotate signing secret</h2>
                  </Localized>
                  {submitError && (
                    <CallOut color="error" fullWidth>
                      {submitError}
                    </CallOut>
                  )}
                  <Localized id="configure-webhooks-rotateSigningSecretHelper">
                    <HelperText>
                      After it expires, signatures will no longer be generated
                      with the old secret.
                    </HelperText>
                  </Localized>
                  <Field name="inactiveIn">
                    {({ input }) => (
                      <FormField>
                        <Localized id="configure-webhooks-expiresOldSecret">
                          <Label>Expire the old secret</Label>
                        </Localized>
                        <SelectField {...input} fullWidth>
                          <Localized id="configure-webhooks-expiresOldSecretImmediately">
                            <Option value="0">Immediately</Option>
                          </Localized>
                          <Localized
                            id="configure-webhooks-expiresOldSecretHoursFromNow"
                            $hours={1}
                          >
                            <Option value="3600">1 hour from now</Option>
                          </Localized>
                          <Localized
                            id="configure-webhooks-expiresOldSecretHoursFromNow"
                            $hours={2}
                          >
                            <Option value="7200">2 hours from now</Option>
                          </Localized>
                          <Localized
                            id="configure-webhooks-expiresOldSecretHoursFromNow"
                            $hours={12}
                          >
                            <Option value="43200">12 hours from now</Option>
                          </Localized>
                          <Localized
                            id="configure-webhooks-expiresOldSecretHoursFromNow"
                            $hours={24}
                          >
                            <Option value="86400">24 hours from now</Option>
                          </Localized>
                        </SelectField>
                      </FormField>
                    )}
                  </Field>
                  <Flex direction="row" justifyContent="flex-end" itemGutter>
                    <Localized id="configure-webhooks-cancelButton">
                      <Button color="regular" onClick={onHide}>
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="configure-webhooks-rotateSigningSecretButton">
                      <Button
                        type="submit"
                        color="alert"
                        disabled={submitting}
                        ref={lastFocusableRef}
                      >
                        Rotate signing secret
                      </Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
              </form>
            )}
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default RotateWebhookEndpointSigningSecretModal;
