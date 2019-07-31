import { Mutator } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { Format, withFormat } from "coral-framework/lib/i18n";

import NotAvailable from "coral-admin/components/NotAvailable";
import {
  Button,
  Card,
  CardCloseButton,
  CheckBox,
  Flex,
  HorizontalGutter,
  Modal,
  RadioButton,
  Typography,
} from "coral-ui/components";

import SuspendSuccessModal from "./SuspendSuccessModal";

import styles from "./SuspendModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onSuccessClose: () => void;
  onConfirm: (timeout: number, message: string) => void;
  format: Format;
  organizationName: string;
  success: boolean;
}

const DURATIONS: Array<[string, string]> = [
  ["3600", "1 hour"],
  ["10800", "3 hours"],
  ["86400", "24 hours"],
  ["604800", "7 days"],
];

const DEFAULT_DURATION_INDEX = 1;

const SuspendModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  format,
  success,
  onSuccessClose,
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

  const setValue: Mutator = ([name, newValue], state, { changeValue }) => {
    if (state.lastFormState) {
      const { durationIndex, emailMessage } = state.lastFormState.values;
      if (getMessageWithDuration(durationIndex) === emailMessage) {
        changeValue(state, name, () => newValue);
      }
    }
  };

  const onFormSubmit = useCallback(
    ({ duration, emailMessage }) => {
      onConfirm(parseInt(duration, 10), emailMessage);
    },
    [onConfirm]
  );

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="suspendModal-title">
        {({ firstFocusableRef, lastFocusableRef }) => (
          <Card className={styles.card}>
            <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
            <HorizontalGutter size="double">
              <HorizontalGutter>
                <Localized
                  id="community-suspendModal-areYouSure"
                  strong={<strong />}
                  $username={username || <NotAvailable />}
                >
                  <Typography variant="header2" id="suspendModal-title">
                    Suspend <strong>{username || <NotAvailable />}</strong>?
                  </Typography>
                </Localized>
              </HorizontalGutter>
              <Localized id="community-suspendModal-consequence">
                <Typography>
                  While suspended, this user will no longer be able to comment,
                  use reactions, or report comments.
                </Typography>
              </Localized>

              <Localized id="community-suspendModal-selectDuration">
                <Typography variant="header3">
                  Select suspension length
                </Typography>
              </Localized>

              <Form
                onSubmit={onFormSubmit}
                mutators={{
                  setValue,
                }}
                initialValues={{
                  durationIndex: `${DEFAULT_DURATION_INDEX}`,
                  emailMessage: getMessageWithDuration(DEFAULT_DURATION_INDEX),
                }}
              >
                {({ handleSubmit, mutators }) => (
                  <form onSubmit={handleSubmit}>
                    <FormSpy subscription={{ dirtyFields: true }}>
                      {({ dirtyFields }) => (
                        <pre>{JSON.stringify(dirtyFields)}</pre>
                      )}
                    </FormSpy>
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
                                mutators.setValue(
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
                    <Field
                      type="checkbox"
                      id="suspend-edit-message"
                      name="editMessage"
                    >
                      {({ input }) => (
                        <Localized id="community-suspendModal-customize">
                          <CheckBox id="suspend-edit-message" {...input}>
                            Customize suspension email message
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
                    <FormSpy subscription={{ values: true }}>
                      {({ values: { editMessage } }) =>
                        editMessage ? (
                          <Field
                            className={styles.textArea}
                            component="textarea"
                            name="emailMessage"
                          />
                        ) : null
                      }
                    </FormSpy>
                    <Flex justifyContent="flex-end" itemGutter="half">
                      <Localized id="community-suspendModal-cancel">
                        <Button variant="outlined" onClick={onClose}>
                          Cancel
                        </Button>
                      </Localized>
                      <Localized id="community-suspendModal-suspendUser">
                        <Button
                          variant="filled"
                          color="primary"
                          type="submit"
                          ref={lastFocusableRef}
                        >
                          Suspend User
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
    </>
  );
};

const enhanced = withFormat(SuspendModal);

export default enhanced;
