import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi } from "final-form";
import React, { FunctionComponent, Ref, useCallback, useMemo } from "react";
import { Field, useFormState } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { validateURL } from "coral-framework/lib/validation";
import {
  Box,
  Button,
  CheckBox,
  Flex,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
  TextField,
} from "coral-ui/components/v2";
import { withForwardRef } from "coral-ui/hocs";

import Subheader from "../../Subheader";
import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./SlackChannel.css";

interface Props {
  channel: string;
  disabled: boolean;
  index: number;
  onRemoveClicked: (index: number) => void;
  form: FormApi;
  forwardRef?: Ref<HTMLInputElement>;
}

const SlackChannel: FunctionComponent<Props> = ({
  channel,
  disabled,
  index,
  onRemoveClicked,
  form,
  forwardRef,
}) => {
  const onRemove = useCallback(() => {
    onRemoveClicked(index);
  }, [index, onRemoveClicked]);

  const formState = useFormState();

  const allSelected = useMemo(() => {
    return formState.values.slack.channels[index].triggers.allComments;
  }, [formState, index]);

  const onAllSelected = useCallback(
    (checked: boolean | undefined) => {
      if (!checked) {
        form.change(`${channel}.triggers.staffComments`, false);
        form.change(`${channel}.triggers.reportedComments`, false);
        form.change(`${channel}.triggers.pendingComments`, false);
        form.change(`${channel}.triggers.featuredComments`, false);
      }
    },
    [form, channel]
  );

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
                      ref={forwardRef}
                      {...input}
                    />
                  </>
                )}
              </Field>
            </FormField>
            <FormField className={styles.textField}>
              <Field name={`${channel}.hookURL`} validate={validateURL}>
                {({ input, meta }) => (
                  <>
                    <Localized id="configure-slack-channel-hookURL-label">
                      <Label>Webhook URL</Label>
                    </Localized>
                    <Localized
                      id="configure-slack-channel-hookURL-description"
                      elems={{
                        externalLink: (
                          <ExternalLink href="https://docs.coralproject.net/slack#i-need-to-find-the-webhook-url-again-where-is-it" />
                        ),
                      }}
                    >
                      <FormFieldDescription className={styles.description}>
                        Slack provides a channel-specific URL to activate
                        webhook connections. To find the URL for one of your
                        Slack channels, follow the instructions here.
                      </FormFieldDescription>
                    </Localized>
                    <TextFieldWithValidation
                      {...input}
                      id={`configure-slack-channel-hookURL-${input.name}`}
                      disabled={disabled || !channelEnabled}
                      fullWidth
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder="https://hooks.slack.com/services/..."
                      meta={meta}
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

              <div className={styles.notificationToggles}>
                <Field
                  name={`${channel}.triggers.allComments`}
                  type="checkbox"
                  parse={parseBool}
                >
                  {({ input }) => (
                    <div className={styles.trigger}>
                      <CheckBox
                        id={`configure-slack-channel-triggers-allComments-${input.name}`}
                        disabled={disabled || !channelEnabled}
                        {...input}
                        onChange={(event) => {
                          onAllSelected(input.checked);
                          input.onChange(event);
                        }}
                      >
                        <Localized id="configure-slack-channel-triggers-allComments">
                          All Comments
                        </Localized>
                      </CheckBox>
                      <Localized id="configure-slack-notRecommended">
                        <HelperText className={styles.triggerHelp}>
                          Not recommended for sites with more than 10K comments
                          per month.
                        </HelperText>
                      </Localized>
                    </div>
                  )}
                </Field>
                <Field
                  name={`${channel}.triggers.staffComments`}
                  type="checkbox"
                  parse={parseBool}
                >
                  {({ input }) => (
                    <CheckBox
                      id={`configure-slack-channel-triggers-staffComments-${input.name}`}
                      disabled={disabled || !channelEnabled || allSelected}
                      className={styles.trigger}
                      {...input}
                    >
                      <Localized id="configure-slack-channel-triggers-staffComments">
                        Staff Comments
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
                      disabled={disabled || !channelEnabled || allSelected}
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
                      disabled={disabled || !channelEnabled || allSelected}
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
                      disabled={disabled || !channelEnabled || allSelected}
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
            </FormField>
            <div>
              <Button
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

export default withForwardRef(SlackChannel);
