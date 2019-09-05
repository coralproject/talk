import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { graphql } from "react-relay";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLDIGEST_FREQUENCY } from "coral-framework/schema";
import { NotificationSettingsContainer_viewer } from "coral-stream/__generated__/NotificationSettingsContainer_viewer.graphql";
import {
  Button,
  CallOut,
  CheckBox,
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  Option,
  SelectField,
  Typography,
} from "coral-ui/components";

import UpdateNotificationSettingsMutation from "./UpdateNotificationSettingsMutation";

interface Props {
  viewer: NotificationSettingsContainer_viewer;
}

type FormProps = NotificationSettingsContainer_viewer["notifications"];

const NotificationSettingsContainer: FunctionComponent<Props> = ({
  viewer: { notifications },
}) => {
  const mutation = useMutation(UpdateNotificationSettingsMutation);
  const onSubmit = useCallback(
    async (values: FormProps) => {
      try {
        await mutation(values);
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        return {
          [FORM_ERROR]: err.message,
        };
      }

      return;
    },
    [mutation]
  );

  return (
    <HorizontalGutter data-testid="profile-settings-notifications">
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
              <Flex justifyContent="space-between" alignItems="flex-start">
                <HorizontalGutter>
                  <Localized id="profile-settings-notifications-emailNotifications">
                    <Typography variant="heading1">
                      Email Notifications
                    </Typography>
                  </Localized>
                  <Localized id="profile-settings-notifications-receiveWhen">
                    <Typography variant="heading4">
                      Receive notifications when:
                    </Typography>
                  </Localized>
                </HorizontalGutter>
                <Localized id="profile-settings-notifications-button-update">
                  <Button
                    color="primary"
                    variant="outlineFilled"
                    type="submit"
                    disabled={submitting || pristine}
                  >
                    Update
                  </Button>
                </Localized>
              </Flex>
              <FieldSet>
                <FormField>
                  <Field name="onReply" type="checkbox">
                    {({ input }) => (
                      <Localized id="profile-settings-notifications-onReply">
                        <CheckBox id={input.name} {...input}>
                          My comment receives a reply
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Field name="onFeatured" type="checkbox">
                    {({ input }) => (
                      <Localized id="profile-settings-notifications-onFeatured">
                        <CheckBox id={input.name} {...input}>
                          My comment is featured
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Field name="onStaffReplies" type="checkbox">
                    {({ input }) => (
                      <Localized id="profile-settings-notifications-onStaffReplies">
                        <CheckBox id={input.name} {...input}>
                          A staff member replies to my comment
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Field name="onModeration" type="checkbox">
                    {({ input }) => (
                      <Localized id="profile-settings-notifications-onModeration">
                        <CheckBox id={input.name} {...input}>
                          My pending comment has been reviewed
                        </CheckBox>
                      </Localized>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Flex alignItems="center" itemGutter>
                    <Localized id="profile-settings-notifications-sendNotifications">
                      <Typography variant="bodyCopyBold">
                        Send Notifications:
                      </Typography>
                    </Localized>
                    <FormSpy subscription={{ values: true }}>
                      {({ values }) => (
                        <Field name="digestFrequency">
                          {({ input }) => (
                            <SelectField
                              id={input.name}
                              {...input}
                              disabled={
                                !values.onReply &&
                                !values.onStaffReplies &&
                                !values.onFeatured &&
                                !values.onModeration
                              }
                            >
                              <Localized id="profile-settings-notifications-sendNotifications-immediately">
                                <Option value={GQLDIGEST_FREQUENCY.NONE}>
                                  Immediately
                                </Option>
                              </Localized>
                              <Localized id="profile-settings-notifications-sendNotifications-daily">
                                <Option value={GQLDIGEST_FREQUENCY.DAILY}>
                                  Daily
                                </Option>
                              </Localized>
                              <Localized id="profile-settings-notifications-sendNotifications-hourly">
                                <Option value={GQLDIGEST_FREQUENCY.HOURLY}>
                                  Hourly
                                </Option>
                              </Localized>
                            </SelectField>
                          )}
                        </Field>
                      )}
                    </FormSpy>
                  </Flex>
                </FormField>
              </FieldSet>
              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}
              {submitSucceeded && (
                <Localized id="profile-settings-notifications-updated">
                  <CallOut color="success" fullWidth>
                    Your notification settings have been updated
                  </CallOut>
                </Localized>
              )}
            </HorizontalGutter>
          </form>
        )}
      </Form>
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
