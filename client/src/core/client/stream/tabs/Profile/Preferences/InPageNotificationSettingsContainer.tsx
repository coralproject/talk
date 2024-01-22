import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  SvgIcon,
} from "coral-ui/components/icons";
import {
  CheckBox,
  FieldSet,
  FormField,
  HorizontalGutter,
  HorizontalRule,
} from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { InPageNotificationSettingsContainer_viewer } from "coral-stream/__generated__/InPageNotificationSettingsContainer_viewer.graphql";

import UpdateInPageNotificationSettingsMutation from "./UpdateInPageNotificationSettingsMutation";

import styles from "./NotificationSettingsContainer.css";

interface Props {
  viewer: InPageNotificationSettingsContainer_viewer;
}

type FormProps =
  InPageNotificationSettingsContainer_viewer["inPageNotifications"];

const InPageNotificationSettingsContainer: FunctionComponent<Props> = ({
  viewer: { inPageNotifications },
}) => {
  const mutation = useMutation(UpdateInPageNotificationSettingsMutation);
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
      className={CLASSES.notifications.$root}
      container="section"
      aria-labelledby="profile-account-notifications-inPageNotifications-title"
    >
      <Form initialValues={{ ...inPageNotifications }} onSubmit={onSubmit}>
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
                <Localized id="profile-account-notifications-inPageNotifications">
                  <h2
                    className={cn(styles.title, CLASSES.notifications.heading)}
                    id="profile-account-notifications-inPageNotifications-title"
                  >
                    In-page Notifications
                  </h2>
                </Localized>
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="profile-account-notifications-includeInPageWhen">
                  <div
                    className={cn(styles.header, CLASSES.notifications.label)}
                    id="profile-account-notifications-includeInPageWhen"
                  >
                    Include notifications when
                  </div>
                </Localized>
                <FieldSet aria-labelledby="profile-account-notifications-includeInPageWhen">
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
                </FieldSet>
              </HorizontalGutter>
              <HorizontalGutter>
                <Localized id="profile-account-notifications-interfacePreferences">
                  <div
                    className={cn(styles.header, CLASSES.notifications.label)}
                    id="profile-account-notifications-interfacePreferences"
                  >
                    Interface preferences
                  </div>
                </Localized>
                <FieldSet aria-labelledby="profile-account-notifications-interfacePreferences">
                  <FormField>
                    <Field name="includeCountInBadge" type="checkbox">
                      {({ input }) => (
                        <Localized id="profile-account-notifications-includeCountInBadge">
                          <CheckBox
                            {...input}
                            id={input.name}
                            className={styles.checkBox}
                            variant="streamBlue"
                          >
                            Include count in badge
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
                  </FormField>
                  <FormField>
                    <Field name="bellRemainsVisible" type="checkbox">
                      {({ input }) => (
                        <Localized id="profile-account-notifications-bellRemainsVisible">
                          <CheckBox
                            {...input}
                            id={input.name}
                            className={styles.checkBox}
                            variant="streamBlue"
                          >
                            Bell remains visible as I scroll
                          </CheckBox>
                        </Localized>
                      )}
                    </Field>
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
                    className={CLASSES.notifications.updateButton}
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
                      icon={<SvgIcon Icon={AlertTriangleIcon} />}
                      titleWeight="semiBold"
                      title={<span>{submitError}</span>}
                      role="alert"
                    />
                  )}
                  {submitSucceeded && showSuccess && (
                    <CallOut
                      color="success"
                      onClose={closeSuccess}
                      icon={<SvgIcon Icon={CheckCircleIcon} />}
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
    fragment InPageNotificationSettingsContainer_viewer on User {
      inPageNotifications {
        onReply
        onFeatured
        onStaffReplies
        onModeration
        includeCountInBadge
        bellRemainsVisible
      }
    }
  `,
})(InPageNotificationSettingsContainer);

export default enhanced;
