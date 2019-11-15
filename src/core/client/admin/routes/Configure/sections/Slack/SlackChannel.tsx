import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useState } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import {
  CheckBox,
  Flex,
  FormField,
  InputDescription,
  InputLabel,
  TextField,
} from "coral-ui/components";

import Header from "../../Header";
import SectionContent from "../../SectionContent";

import styles from "./SlackChannel.css";

interface Props {
  channel: any;
  disabled: boolean;
  index: number;
}

const SlackChannel: FunctionComponent<Props> = ({
  channel,
  disabled,
  index,
}) => {
  const [allComments, setAllComments] = useState(false);

  return (
    <>
      <FormField className={styles.header}>
        <Header>
          <Flex justifyContent="space-between">
            <Localized id="configure-slack-channel-name">Channel</Localized>
            <Field
              name={`${channel}.enabled`}
              type="checkbox"
              parse={parseBool}
            >
              {({ input }) => (
                <CheckBox
                  id={`configure-slack-channel-enabled-${input.name}`}
                  disabled={disabled}
                  light
                  {...input}
                >
                  <Localized id="configure-slack-channel-enabled">
                    Enabled
                  </Localized>
                </CheckBox>
              )}
            </Field>
          </Flex>
        </Header>
      </FormField>
      <SectionContent>
        <FormField>
          <Field name={`${channel}.hookURL`}>
            {({ input, meta }) => (
              <>
                <Localized id="configure-slack-channel-hookURL-label">
                  <InputLabel container="legend">Webhook URL</InputLabel>
                </Localized>
                <Localized id="configure-slack-channel-hookURL-description">
                  <InputDescription className={styles.hookURLDescription}>
                    Slack provides a channel-specific URL to activate webhook
                    connections. To find the URL for one of your Slack channels,
                    follow these instructions: url
                  </InputDescription>
                </Localized>
                <TextField
                  id={`configure-slack-channel-hookURL-${input.name}`}
                  disabled={disabled}
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
            type="checkbox"
            parse={parseBool}
          >
            {({ input }) => {
              setAllComments(input.value);
              return (
                <CheckBox
                  id={`configure-slack-channel-triggers-allComments-${input.name}`}
                  disabled={disabled}
                  className={styles.trigger}
                  {...input}
                >
                  <Localized id="configure-slack-channel-triggers-allComments">
                    All Comments
                  </Localized>
                </CheckBox>
              );
            }}
          </Field>
          <Field
            name={`${channel}.triggers.reportedComments`}
            type="checkbox"
            parse={parseBool}
          >
            {({ input }) => (
              <CheckBox
                id={`configure-slack-channel-triggers-reportedComments-${input.name}`}
                disabled={disabled || allComments}
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
                disabled={disabled || allComments}
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
                disabled={disabled || allComments}
                className={styles.trigger}
                {...input}
              >
                <Localized id="configure-slack-channel-triggers-featuredComments">
                  Featured Comments
                </Localized>
              </CheckBox>
            )}
          </Field>
        </FormField>
      </SectionContent>
    </>
  );
};

export default SlackChannel;
