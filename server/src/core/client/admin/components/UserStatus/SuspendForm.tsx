import { Localized } from "@fluent/react/compat";
import { Mutator } from "final-form";
import React, { FunctionComponent, RefObject, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { ScaledUnit } from "coral-common/helpers/i18n";
import { useGetMessage } from "coral-framework/lib/i18n";
import {
  Button,
  CheckBox,
  Flex,
  HorizontalGutter,
  Label,
  RadioButton,
  Textarea,
} from "coral-ui/components/v2";

import styles from "./SuspendForm.css";

interface Props {
  username: string | null;
  onCancel: () => void;
  organizationName: string;
  onSubmit: (duration: ScaledUnit, message: string) => void;
  lastFocusableRef: RefObject<any>;
}

interface FormStateValues {
  duration: any;
  emailMessage: any;
}

const DURATIONS: ScaledUnit[] = [
  { original: 3600, value: "3600", unit: "hour", scaled: 1 }, // 1 hour
  { original: 10800, value: "10800", unit: "hour", scaled: 3 }, // 3 hours
  { original: 86400, value: "86400", unit: "hour", scaled: 24 }, // 24 hours
  { original: 604800, value: "604800", unit: "day", scaled: 7 }, // 7 days
];

const DEFAULT_DURATION = DURATIONS[0]; // 1 hour

const SuspendForm: FunctionComponent<Props> = ({
  onCancel,
  username,
  onSubmit,
  organizationName,
  lastFocusableRef,
}) => {
  const getMessage = useGetMessage();
  const getMessageWithDuration = useCallback(
    ({ scaled, unit }: Pick<ScaledUnit, "scaled" | "unit">): string => {
      return getMessage(
        "community-suspendModal-emailTemplate",
        `your account has been temporarily suspended. During the suspension, you will be unable to comment, flag or engage with fellow commenters. Please rejoin the conversation in ${scaled} ${unit}`,
        {
          username,
          organizationName,
          value: scaled,
          unit,
        }
      );
    },
    [username, organizationName]
  );

  const onFormSubmit = useCallback(
    ({
      duration,
      emailMessage,
    }: {
      duration: ScaledUnit["value"];
      emailMessage: string;
    }) => {
      const unit = DURATIONS.find((d) => d.value === duration);
      onSubmit(unit!, emailMessage);
    },
    [onSubmit]
  );

  const setMessageValue: Mutator = useCallback(
    ([name, newValue], state, { changeValue }) => {
      if (state.lastFormState) {
        const { duration, emailMessage } = state.lastFormState
          .values as FormStateValues;
        const unit = DURATIONS.find((d) => d.value === duration);
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
      const { duration, emailMessage } = state.lastFormState
        .values as FormStateValues;
      const unit = DURATIONS.find((d) => d.value === duration);
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
            <HorizontalGutter spacing={3}>
              <HorizontalGutter spacing={1}>
                <Localized id="community-suspendModal-selectDuration">
                  <Label>Select suspension length</Label>
                </Localized>

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
                          vars={{ value: scaled, unit }}
                        >
                          <RadioButton
                            {...input}
                            id={`duration-${value}`}
                            onChange={(event) => {
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
              </HorizontalGutter>
              <Field type="checkbox" name="editMessage">
                {({ input }) => (
                  <Localized id="community-suspendModal-customize">
                    <CheckBox
                      {...input}
                      id="suspendModal-editMessage"
                      onChange={(event) => {
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
                    <Field component="textarea" name="emailMessage">
                      {({ input }) => (
                        <Textarea
                          id="suspendModal-message"
                          {...input}
                          className={styles.textArea}
                          fullwidth
                        />
                      )}
                    </Field>
                  ) : null
                }
              </Field>
              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-suspendModal-cancel">
                  <Button variant="flat" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
                <Localized id="community-suspendModal-suspendUser">
                  <Button ref={lastFocusableRef} type="submit">
                    Suspend User
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

export default SuspendForm;
