import { Localized } from "@fluent/react/compat";
import { Mutator } from "final-form";
import React, { FunctionComponent, RefObject, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import {
  Button,
  Flex,
  HelperText,
  HorizontalGutter,
  Label,
  Textarea,
} from "coral-ui/components/v2";

import styles from "./WarnForm.css";

interface Props {
  username: string | null;
  onCancel: () => void;
  getMessage: GetMessage;
  organizationName: string;
  onSubmit: (message: string) => void;
  lastFocusableRef: RefObject<any>;
}

interface FormStateValues {
  message: any;
}

const SuspendForm: FunctionComponent<Props> = ({
  onCancel,
  username,
  getMessage,
  onSubmit,
  organizationName,
  lastFocusableRef,
}) => {
  const getMessageBody = useCallback((): string => {
    return getMessage(
      "community-warnModal-messageTemplate",
      `this is a a warning.`,
      {
        username,
        organizationName,
      }
    );
  }, [username, organizationName, getMessage]);

  const onFormSubmit = useCallback(
    ({ message }) => {
      onSubmit(message);
    },
    [onSubmit]
  );

  const setMessageValue: Mutator = useCallback(
    ([name, newValue], state, { changeValue }) => {
      if (state.lastFormState) {
        const { message } = state.lastFormState.values as FormStateValues;
        const expectedEmailMessage = getMessageBody();
        if (expectedEmailMessage === message) {
          changeValue(state, name, () => newValue);
        }
      }
    },
    [getMessageBody]
  );

  const resetMessageValue: Mutator = (
    [name, checked],
    state,
    { changeValue }
  ) => {
    if (state.lastFormState && !checked) {
      const { message } = state.lastFormState.values as FormStateValues;
      const expectedEmailMessage = getMessageBody();
      if (expectedEmailMessage !== message) {
        changeValue(state, name, () => expectedEmailMessage);
      }
    }
  };

  return (
    <>
      <Form
        onSubmit={onFormSubmit}
        mutators={{
          setMessageValue,
          resetMessageValue,
        }}
        initialValues={{
          message: getMessageBody(),
        }}
      >
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter spacing={3}>
              <Localized id="community-warnModal-message-label">
                <Label>Message</Label>
              </Localized>
              <Localized id="community-warnModal-message-description">
                <HelperText>
                  Explain to this user how they should change their behavior on
                  your site.
                </HelperText>
              </Localized>
              <Field component="textarea" name="message">
                {({ input }) => (
                  <Textarea
                    id="warnModal-message"
                    {...input}
                    className={styles.textArea}
                    fullwidth
                  />
                )}
              </Field>
              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-warnModal-cancel">
                  <Button variant="flat" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
                <Localized id="community-warnModal-warnUser">
                  <Button ref={lastFocusableRef} type="submit">
                    Warn User
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

const enhanced = withGetMessage(SuspendForm);

export default enhanced;
