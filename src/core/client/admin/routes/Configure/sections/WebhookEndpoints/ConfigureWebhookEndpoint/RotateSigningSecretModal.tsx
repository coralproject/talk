import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

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

import RotateWebhookEndpointSecretMutation from "./RotateWebhookEndpointSecretMutation";

import styles from "./RotateSigningSecretModal.css";

interface Props {
  endpointID: string;
  onHide: () => void;
  open: boolean;
}

const RotateWebhookEndpointSecretModal: FunctionComponent<Props> = ({
  onHide,
  open,
  endpointID,
}) => {
  const rotateWebhookEndpointSecret = useMutation(
    RotateWebhookEndpointSecretMutation
  );
  const onRotateSecret = useCallback(
    async ({ inactiveIn: inactiveInString }) => {
      try {
        const inactiveIn = parseInt(inactiveInString, 10);
        await rotateWebhookEndpointSecret({ id: endpointID, inactiveIn });
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
    [endpointID, rotateWebhookEndpointSecret]
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

export default RotateWebhookEndpointSecretModal;
