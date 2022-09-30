import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, RefObject, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { required } from "coral-framework/lib/validation";
import {
  Button,
  Flex,
  HorizontalGutter,
  Label,
  Textarea,
} from "coral-ui/components/v2";

import styles from "./ModMessageForm.css";

interface Props {
  onCancel: () => void;
  onSubmit: (message: string) => void;
  lastFocusableRef: RefObject<any>;
}

const ModMessageForm: FunctionComponent<Props> = ({
  onCancel,
  onSubmit,
  lastFocusableRef,
}) => {
  const onFormSubmit = useCallback(
    ({ message }: { message: string }) => {
      onSubmit(message);
    },
    [onSubmit]
  );

  return (
    <>
      <Form onSubmit={onFormSubmit}>
        {({ handleSubmit, invalid, form }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter spacing={3}>
              <HorizontalGutter spacing={1}>
                <Flex alignItems="baseline" spacing={1}>
                  <Localized id="community-modMessageModal-message-label">
                    <Label className={styles.label}>Message</Label>
                  </Localized>
                  <Localized id="community-modMessageModal-message-required">
                    <span className={styles.required}>Required</span>
                  </Localized>
                </Flex>
              </HorizontalGutter>
              <Field component="textarea" name="message" validate={required}>
                {({ input }) => (
                  <Textarea
                    data-testid="modMessageModal-message"
                    {...input}
                    fullwidth
                  />
                )}
              </Field>
              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-modMessageModal-cancel">
                  <Button variant="flat" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
                <Localized id="community-modMessageModal-messageUser">
                  <Button
                    ref={lastFocusableRef}
                    type="submit"
                    disabled={invalid}
                  >
                    Message User
                  </Button>
                </Localized>
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </>
  );
};

export default ModMessageForm;
