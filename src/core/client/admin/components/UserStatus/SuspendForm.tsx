import { Mutator } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { Format, withFormat } from "coral-framework/lib/i18n";

import {
  Button,
  CheckBox,
  Flex,
  HorizontalGutter,
  RadioButton,
} from "coral-ui/components";

import styles from "./SuspendModal.css";

interface Props {
  username: string | null;
  onCancel: () => void;
  format: Format;
  organizationName: string;
  onSubmit: (duration: [number, string], message: string) => void;
}

const DURATIONS: Array<[number, string]> = [
  [3600, "1 hour"],
  [10800, "3 hours"],
  [86400, "24 hours"],
  [604800, "7 days"],
];

const DEFAULT_DURATION_INDEX = 1;

const SuspendModal: FunctionComponent<Props> = ({
  onCancel,
  username,
  format,
  onSubmit,
  organizationName,
}) => {
  const getMessageWithDuration = useCallback(
    (index: number): string => {
      return format("community-suspendModal-emailTemplate", {
        username,
        organizationName,
        duration: DURATIONS[index][1],
      });
    },
    [username, organizationName]
  );

  const onFormSubmit = useCallback(
    ({ durationIndex, emailMessage }) => {
      onSubmit(DURATIONS[parseInt(durationIndex, 10)], emailMessage);
    },
    [onSubmit]
  );

  const setMessageValue: Mutator = (
    [name, newValue],
    state,
    { changeValue }
  ) => {
    if (state.lastFormState) {
      const { durationIndex, emailMessage } = state.lastFormState.values;
      if (getMessageWithDuration(durationIndex) === emailMessage) {
        changeValue(state, name, () => newValue);
      }
    }
  };

  const resetMessageValue: Mutator = (
    [name, checked],
    state,
    { changeValue }
  ) => {
    if (state.lastFormState && !checked) {
      const { durationIndex, emailMessage } = state.lastFormState.values;
      if (getMessageWithDuration(durationIndex) !== emailMessage) {
        changeValue(state, name, () => getMessageWithDuration(durationIndex));
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
          durationIndex: `${DEFAULT_DURATION_INDEX}`,
          emailMessage: getMessageWithDuration(DEFAULT_DURATION_INDEX),
        }}
      >
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter spacing={2}>
              <div>
                {DURATIONS.map(([value, label], index) => (
                  <Field
                    key={value}
                    name="durationIndex"
                    type="radio"
                    component="input"
                    value={`${index}`}
                  >
                    {({ input }) => (
                      <Localized
                        id={`community-suspendModal-duration-${value}`}
                      >
                        <RadioButton
                          id={`duration-${value}`}
                          {...input}
                          onChange={event => {
                            form.mutators.setMessageValue(
                              "emailMessage",
                              getMessageWithDuration(index)
                            );
                            input.onChange(event);
                          }}
                        >
                          <span>{label}</span>
                        </RadioButton>
                      </Localized>
                    )}
                  </Field>
                ))}
              </div>
              <Field type="checkbox" name="editMessage">
                {({ input }) => (
                  <Localized id="community-suspendModal-customize">
                    <CheckBox
                      id="suspendModal-editMessage"
                      {...input}
                      onChange={event => {
                        form.mutators.resetMessageValue(
                          "emailMessage",
                          !input.checked
                        );
                        input.onChange(event);
                      }}
                    >
                      Customize suspension email message
                    </CheckBox>
                  </Localized>
                )}
              </Field>
              <Field name="editMessage" subscription={{ value: true }}>
                {({ input: { value } }) =>
                  value ? (
                    <Field
                      className={styles.textArea}
                      id="suspendModal-message"
                      component="textarea"
                      name="emailMessage"
                    />
                  ) : null
                }
              </Field>
            </HorizontalGutter>
            <Flex
              className={styles.footer}
              justifyContent="flex-end"
              itemGutter="half"
            >
              <Localized id="community-suspendModal-cancel">
                <Button variant="outlined" onClick={onCancel}>
                  Cancel
                </Button>
              </Localized>
              <Localized id="community-suspendModal-suspendUser">
                <Button variant="filled" color="primary" type="submit">
                  Suspend User
                </Button>
              </Localized>
            </Flex>
          </form>
        )}
      </Form>
    </>
  );
};

const enhanced = withFormat(SuspendModal);

export default enhanced;
