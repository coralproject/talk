import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { InputDescription, InputLabel } from "coral-ui/components";
import {
  Button,
  ButtonIcon,
  CheckBox,
  Flex,
  FormField,
  TextField,
} from "coral-ui/components/v2";

import Header from "../../Header";
import ConfigBoxWithToggleField from "../Auth/ConfigBoxWithToggleField";

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
    <ConfigBoxWithToggleField
      title={
        <Flex
          className={styles.header}
          justifyContent="space-between"
          alignItems="center"
        >
          <div>
            <Field name={`${channel}.name`}>
              {({ input }) => (
                <Header className={styles.channelName}>{input.value}</Header>
              )}
            </Field>
          </div>
          <div>
            <Button
              size="small"
              variant="filled"
              color="alert"
              onClick={onRemove}
              className={styles.removeButton}
            >
              <ButtonIcon size="md" className={styles.buttonIcon}>
                delete_forever
              </ButtonIcon>
              <Localized id="configure-slack-channel-remove">Remove</Localized>
            </Button>
          </div>
        </Flex>
      }
      name={`${channel}.enabled`}
      disabled={disabled}
    >
      {(disabledInside: boolean) => (
        <>
          <FormField>
            <Field name={`${channel}.name`}>
              {({ input, meta }) => (
                <>
                  <Localized id="configure-slack-channel-name-label">
                    <InputLabel container="legend">Name</InputLabel>
                  </Localized>
                  <Localized id="configure-slack-channel-name-description">
                    <InputDescription className={styles.description}>
                      This is only for your information, to easily identify each
                      Slack connection. Slack does not tell us the name of the
                      channel/s you're connecting to Coral.
                    </InputDescription>
                  </Localized>
                  <TextField
                    id={`configure-slack-channel-name-${input.name}`}
                    disabled={disabled || disabledInside}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    fullWidth
                    {...input}
                  />
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Field name={`${channel}.hookURL`}>
              {({ input, meta }) => (
                <>
                  <Localized id="configure-slack-channel-hookURL-label">
                    <InputLabel container="legend">Webhook URL</InputLabel>
                  </Localized>
                  <Localized
                    id="configure-slack-channel-hookURL-description"
                    externalLink={
                      <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/slack/#i-need-to-find-the-webhook-url-again-where-is-it" />
                    }
                  >
                    <InputDescription className={styles.description}>
                      Slack provides a channel-specific URL to activate webhook
                      connections. To find the URL for one of your Slack
                      channels, follow the instructions here.
                    </InputDescription>
                  </Localized>
                  <TextField
                    id={`configure-slack-channel-hookURL-${input.name}`}
                    disabled={disabled || disabledInside}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    fullWidth
                    {...input}
                  />
                </>
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-slack-channel-triggers-label">
              <InputLabel container="legend">
                Receive notifications in this Slack channel for
              </InputLabel>
            </Localized>
            <Field
              name={`${channel}.triggers.allComments`}
              subscription={{ value: true }}
            >
              {({ input: { value } }) => (
                <>
                  <Field
                    name={`${channel}.triggers.allComments`}
                    type="checkbox"
                    parse={parseBool}
                  >
                    {({ input }) => (
                      <CheckBox
                        id={`configure-slack-channel-triggers-allComments-${input.name}`}
                        disabled={disabled || disabledInside}
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
                        disabled={disabled || value || disabledInside}
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
                        disabled={disabled || value || disabledInside}
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
                        disabled={disabled || value || disabledInside}
                        className={styles.trigger}
                        {...input}
                      >
                        <Localized id="configure-slack-channel-triggers-featuredComments">
                          Featured Comments
                        </Localized>
                      </CheckBox>
                    )}
                  </Field>
                </>
              )}
            </Field>
          </FormField>
        </>
      )}
    </ConfigBoxWithToggleField>
  );
};

export default SlackChannel;
