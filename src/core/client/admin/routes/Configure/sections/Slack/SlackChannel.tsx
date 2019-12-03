import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Box,
  Button,
  CheckBox,
  Flex,
  FormField,
  FormFieldDescription,
  Label,
  TextField,
} from "coral-ui/components/v2";

import Subheader from "../../Subheader";

import styles from "./SlackChannel.css";

interface Props {
  channel: any;
  disabled: boolean;
  index: number;
  onRemoveClicked: (index: number) => void;
}

const SlackChannel: FunctionComponent<Props> = ({
  channel,
  disabled,
  index,
  onRemoveClicked,
}) => {
  const onRemove = useCallback(() => {
    onRemoveClicked(index);
  }, [index, onRemoveClicked]);

  return (
    <>
      <Field name={`${channel}.name`}>
        {({ input }) => (
          <Subheader>
            <Flex justifyContent="space-between">
              <div>
                {input.value ? (
                  input.value
                ) : (
                  <Localized id="configure-slack-channel-defaultName">
                    New channel
                  </Localized>
                )}
              </div>
              <div>
                <Field
                  name={`${channel}.enabled`}
                  type="checkbox"
                  parse={parseBool}
                >
                  {({ input: enabledInput }) => (
                    <Localized id="configure-auth-configBoxEnabled">
                      <CheckBox
                        id={`${channel}.enabled`}
                        disabled={disabled}
                        className={styles.enabledCheckbox}
                        {...enabledInput}
                      >
                        Enabled
                      </CheckBox>
                    </Localized>
                  )}
                </Field>
              </div>
            </Flex>
          </Subheader>
        )}
      </Field>
      <Field name={`${channel}.enabled`} subscription={{ value: true }}>
        {({ input: { value: channelEnabled } }) => (
          <Box className={styles.content}>
            <FormField>
              <Field name={`${channel}.name`}>
                {({ input }) => (
                  <>
                    <Localized id="configure-slack-channel-name-label">
                      <Label>Name</Label>
                    </Localized>
                    <Localized id="configure-slack-channel-name-description">
                      <FormFieldDescription className={styles.description}>
                        This is only for your information, to easily identify
                        each Slack connection. Slack does not tell us the name
                        of the channel/s you're connecting to Coral.
                      </FormFieldDescription>
                    </Localized>
                    <TextField
                      id={`configure-slack-channel-name-${input.name}`}
                      disabled={disabled || !channelEnabled}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      fullWidth
                      className={styles.textField}
                      {...input}
                    />
                  </>
                )}
              </Field>
            </FormField>
            <FormField>
              <Field name={`${channel}.hookURL`}>
                {({ input }) => (
                  <>
                    <Localized id="configure-slack-channel-hookURL-label">
                      <Label>Webhook URL</Label>
                    </Localized>
                    <Localized
                      id="configure-slack-channel-hookURL-description"
                      externalLink={
                        <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/slack/#i-need-to-find-the-webhook-url-again-where-is-it" />
                      }
                    >
                      <FormFieldDescription className={styles.description}>
                        Slack provides a channel-specific URL to activate
                        webhook connections. To find the URL for one of your
                        Slack channels, follow the instructions here.
                      </FormFieldDescription>
                    </Localized>
                    <TextField
                      id={`configure-slack-channel-hookURL-${input.name}`}
                      disabled={disabled || !channelEnabled}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      fullWidth
                      className={styles.textField}
                      {...input}
                    />
                  </>
                )}
              </Field>
            </FormField>
            <FormField>
              <div className={styles.notificationsLabel}>
                <Localized id="configure-slack-channel-triggers-label">
                  <Label>Receive notifications in this Slack channel for</Label>
                </Localized>
              </div>
              <Field
                name={`${channel}.triggers.allComments`}
                subscription={{ value: true }}
              >
                {({ input: { value: allCommentsValue } }) => (
                  <div className={styles.notificationToggles}>
                    <Field
                      name={`${channel}.triggers.allComments`}
                      type="checkbox"
                      parse={parseBool}
                    >
                      {({ input }) => (
                        <CheckBox
                          id={`configure-slack-channel-triggers-allComments-${input.name}`}
                          disabled={disabled || !channelEnabled}
                          className={styles.trigger}
                          {...input}
                        >
                          <Localized id="configure-slack-channel-triggers-allComments">
                            All Comments
                          </Localized>
                        </CheckBox>
                      )}
                    </Field>
                    <Field
                      name={`${channel}.triggers.reportedComments`}
                      type="checkbox"
                      parse={parseBool}
                    >
                      {({ input }) => (
                        <CheckBox
                          id={`configure-slack-channel-triggers-reportedComments-${input.name}`}
                          disabled={
                            disabled || allCommentsValue || !channelEnabled
                          }
                          className={styles.trigger}
                          {...input}
                        >
                          <Localized id="configure-slack-channel-triggers-reportedComments">
                            Reported Comments
                          </Localized>
                        </CheckBox>
                      )}
                    </Field>
                    <Field
                      name={`${channel}.triggers.pendingComments`}
                      type="checkbox"
                      parse={parseBool}
                    >
                      {({ input }) => (
                        <CheckBox
                          id={`configure-slack-channel-triggers-pendingComments-${input.name}`}
                          disabled={
                            disabled || allCommentsValue || !channelEnabled
                          }
                          className={styles.trigger}
                          {...input}
                        >
                          <Localized id="configure-slack-channel-triggers-pendingComments">
                            Pending Comments
                          </Localized>
                        </CheckBox>
                      )}
                    </Field>
                    <Field
                      name={`${channel}.triggers.featuredComments`}
                      type="checkbox"
                      parse={parseBool}
                    >
                      {({ input }) => (
                        <CheckBox
                          id={`configure-slack-channel-triggers-featuredComments-${input.name}`}
                          disabled={
                            disabled || allCommentsValue || !channelEnabled
                          }
                          className={styles.trigger}
                          {...input}
                        >
                          <Localized id="configure-slack-channel-triggers-featuredComments">
                            Featured Comments
                          </Localized>
                        </CheckBox>
                      )}
                    </Field>
                  </div>
                )}
              </Field>
            </FormField>
            <div>
              <Button
                size="medium"
                variant="filled"
                color="alert"
                onClick={onRemove}
                className={cn(styles.removeButton, styles.button)}
              >
                <Localized id="configure-slack-channel-remove">
                  Remove
                </Localized>
              </Button>
            </div>
          </Box>
        )}
      </Field>
    </>
  );
};

export default SlackChannel;
