import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLDIGEST_FREQUENCY } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import {
  CheckBox,
  FieldSet,
  FormField,
  HorizontalGutter,
  HorizontalRule,
  Icon,
  Option,
  SelectField,
} from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { NotificationSettingsContainer_viewer } from "coral-stream/__generated__/NotificationSettingsContainer_viewer.graphql";

import UpdateNotificationSettingsMutation from "./UpdateNotificationSettingsMutation";

import styles from "./NotificationSettingsContainer.css";

interface Props {
  viewer: NotificationSettingsContainer_viewer;
}

type FormProps = NotificationSettingsContainer_viewer["notifications"];

const NotificationSettingsContainer: FunctionComponent<Props> = ({
  viewer: { notifications },
}) => {
  const mutation = useMutation(UpdateNotificationSettingsMutation);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const closeSuccess = useCallback(() => {
    setShowSuccess(false);
  }, [setShowSuccess]);
  const closeError = useCallback(() => {
    setShowError(false);
  }, [setShowError]);
  const onSubmit = useCallback(
    async (values: FormProps) => {
      try {
        await mutation(values);
        setShowSuccess(true);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        setShowError(true);
        return {
          [FORM_ERROR]: err.message,
        };
      }

      return;
    },
    [mutation, setShowSuccess, setShowError]
  );

  return (
    <HorizontalGutter
      data-testid="profile-account-notifications"
      className={CLASSES.emailNotifications.$root}
      container="section"
      aria-labelledby="profile-account-notifications-emailNotifications-title"
    >
      <Form initialValues={{ ...notifications }} onSubmit={onSubmit}>
        {({
          handleSubmit,
          submitting,
          submitError,
          pristine,
          submitSucceeded,
        }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter>
              <HorizontalGutter>
                <Localized id="profile-account-notifications-emailNotifications">
                  <h2
                    className={cn(
                      styles.title,
                      CLASSES.emailNotifications.heading
                    )}
                    id="profile-account-notifications-emailNotifications-title"
                  >
                    Email Notifications
                  </h2>
                </Localized>
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="profile-account-notifications-receiveWhen">
                  <div
                    className={cn(
                      styles.header,
                      CLASSES.emailNotifications.label
                    )}
                    id="profile-account-notifications-receiveWhen"
                  >
                    Receive notifications when:
                  </div>
                </Localized>
                <FieldSet aria-labelledby="profile-account-notifications-receiveWhen">
                  <FormField>
                    <Field name="onReply" type="checkbox">
                      {({ input }) => (
                        <Localized id="profile-account-notifications-onReply">
                          <CheckBox
                            {...input}
                            id={input.name}
                            className={styles.checkBox}
                            variant="streamBlue"
                          >
                            My comment receives a reply
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
                  </FormField>
                  <FormField>
                    <Field name="onFeatured" type="checkbox">
                      {({ input }) => (
                        <Localized id="profile-account-notifications-onFeatured">
                          <CheckBox
                            {...input}
                            id={input.name}
                            className={styles.checkBox}
                            variant="streamBlue"
                          >
                            My comment is featured
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
                  </FormField>
                  <FormField>
                    <Field name="onStaffReplies" type="checkbox">
                      {({ input }) => (
                        <Localized id="profile-account-notifications-onStaffReplies">
                          <CheckBox
                            {...input}
                            id={input.name}
                            className={styles.checkBox}
                            variant="streamBlue"
                          >
                            A staff member replies to my comment
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
                  </FormField>
                  <FormField>
                    <Field name="onModeration" type="checkbox">
                      {({ input }) => (
                        <Localized id="profile-account-notifications-onModeration">
                          <CheckBox
                            {...input}
                            id={input.name}
                            className={styles.checkBox}
                            variant="streamBlue"
                          >
                            My pending comment has been reviewed
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
                  </FormField>
                  <FormField>
                    <Localized id="profile-account-notifications-sendNotifications">
                      <label
                        className={cn(
                          styles.header,
                          styles.sendNotifications,
                          CLASSES.emailNotifications.label
                        )}
                        htmlFor="digestFrequency"
                      >
                        Send Notifications:
                      </label>
                    </Localized>
                    <FormSpy subscription={{ values: true }}>
                      {({ values }) => (
                        <Field name="digestFrequency">
                          {({ input }) => (
                            <div>
                              <SelectField
                                {...input}
                                id={input.name}
                                disabled={
                                  !values.onReply &&
                                  !values.onStaffReplies &&
                                  !values.onFeatured &&
                                  !values.onModeration
                                }
                              >
                                <Localized id="profile-account-notifications-sendNotifications-immediately">
                                  <Option value={GQLDIGEST_FREQUENCY.NONE}>
                                    Immediately
                                  </Option>
                                </Localized>
                                <Localized id="profile-account-notifications-sendNotifications-daily">
                                  <Option value={GQLDIGEST_FREQUENCY.DAILY}>
                                    Daily
                                  </Option>
                                </Localized>
                                <Localized id="profile-account-notifications-sendNotifications-hourly">
                                  <Option value={GQLDIGEST_FREQUENCY.HOURLY}>
                                    Hourly
                                  </Option>
                                </Localized>
                              </SelectField>
                            </div>
                          )}
                        </Field>
                      )}
                    </FormSpy>
                  </FormField>
                </FieldSet>
              </HorizontalGutter>
              <div
                className={cn(styles.updateButton, {
                  [styles.updateButtonNotification]: showSuccess || showError,
                })}
              >
                <Localized id="profile-account-notifications-button-update">
                  <Button
                    type="submit"
                    disabled={submitting || pristine}
                    className={CLASSES.emailNotifications.updateButton}
                    upperCase
                  >
                    Update
                  </Button>
                </Localized>
              </div>
              {((submitError && showError) ||
                (submitSucceeded && showSuccess)) && (
                <div className={styles.callOut}>
                  {submitError && showError && (
                    <CallOut
                      color="error"
                      onClose={closeError}
                      icon={<Icon size="sm">warning</Icon>}
                      titleWeight="semiBold"
                      title={<span>{submitError}</span>}
                      role="alert"
                    />
                  )}
                  {submitSucceeded && showSuccess && (
                    <CallOut
                      color="success"
                      onClose={closeSuccess}
                      icon={<Icon size="sm">check_circle</Icon>}
                      titleWeight="semiBold"
                      title={
                        <Localized id="profile-account-notifications-updated">
                          <span>
                            Your notification settings have been updated
                          </span>
                        </Localized>
                      }
                      role="dialog"
                      aria-live="polite"
                    />
                  )}
                </div>
              )}
            </HorizontalGutter>
          </form>
        )}
      </Form>
      <HorizontalRule></HorizontalRule>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment NotificationSettingsContainer_viewer on User {
      notifications {
        onReply
        onFeatured
        onStaffReplies
        onModeration
        digestFrequency
      }
    }
  `,
})(NotificationSettingsContainer);

export default enhanced;
