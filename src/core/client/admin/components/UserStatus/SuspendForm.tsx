import { Mutator } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import {
  Format,
  reduceSeconds,
  ScaledUnit,
  withFormat,
} from "coral-framework/lib/i18n";

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
  onSubmit: (duration: number, message: string) => void;
}

const DURATIONS: ScaledUnit[] = [
  { original: 3600, value: "3600", unit: "hour", scaled: 1 }, // 1 hour
  { original: 10800, value: "10800", unit: "hour", scaled: 3 }, // 3 hours
  { original: 86400, value: "86400", unit: "hour", scaled: 24 }, // 24 hours
  { original: 604800, value: "604800", unit: "day", scaled: 7 }, // 7 days
];

const DEFAULT_DURATION = DURATIONS[0]; // 1 hour

const SuspendModal: FunctionComponent<Props> = ({
  onCancel,
  username,
  format,
  onSubmit,
  organizationName,
}) => {
  const getMessageWithDuration = useCallback(
    ({ scaled, unit }: Pick<ScaledUnit, "scaled" | "unit">): string => {
      return format("community-suspendModal-emailTemplate", {
        username,
        organizationName,
        value: scaled,
        unit,
      });
    },
    [username, organizationName]
  );

  const onFormSubmit = useCallback(
    ({ duration, emailMessage }) => {
      onSubmit(parseInt(duration, 10), emailMessage);
    },
    [onSubmit]
  );

  const setMessageValue: Mutator = useCallback(
    ([name, newValue], state, { changeValue }) => {
      if (state.lastFormState) {
        const { duration, emailMessage } = state.lastFormState.values;
        const unit = DURATIONS.find(d => d.value === duration);
        const expectedEmailMessage = getMessageWithDuration(unit!);
        if (expectedEmailMessage === emailMessage) {
          changeValue(state, name, () => newValue);
        }
      }
    },
    [getMessageWithDuration]
  );

  const resetMessageValue: Mutator = (
    [name, checked],
    state,
    { changeValue }
  ) => {
    if (state.lastFormState && !checked) {
      const { duration, emailMessage } = state.lastFormState.values;
      const unit = DURATIONS.find(d => d.value === duration);
      const expectedEmailMessage = getMessageWithDuration(unit!);
      if (expectedEmailMessage !== emailMessage) {
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
          duration: DEFAULT_DURATION.value,
          emailMessage: getMessageWithDuration(DEFAULT_DURATION),
        }}
      >
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter spacing={2}>
              <div>
                {DURATIONS.map(({ original, value, scaled, unit }) => (
                  <Field
                    key={value}
                    name="duration"
                    type="radio"
                    component="input"
                    value={value}
                  >
                    {({ input }) => (
                      <Localized
                        id="framework-timeago-time"
                        $value={scaled}
                        $unit={unit}
                      >
                        <RadioButton
                          id={`duration-${value}`}
                          {...input}
                          onChange={event => {
                            form.mutators.setMessageValue(
                              "emailMessage",
                              getMessageWithDuration({ scaled, unit })
                            );
                            input.onChange(event);
                          }}
                        >
                          <span>
                            {scaled} {unit}
                          </span>
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
