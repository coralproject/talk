import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { MarkdownEditor } from "coral-framework/components/loadables";
import {
  formatEmpty,
  parseEmptyAsNull,
  parseWithDOMPurify,
} from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import FieldValidationMessage from "coral-stream/common/FieldValidationMessage";
import {
  MessageBox,
  MessageBoxContent,
  MessageBoxIcon,
} from "coral-stream/common/MessageBox";
import {
  AriaInfo,
  HorizontalGutter,
  Icon,
  Spinner,
  TileOption,
  TileSelector,
  Typography,
} from "coral-ui/components/v2";

import styles from "./MessageBoxConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment MessageBoxConfig_formValues on StorySettings {
    messageBox {
      enabled
      content
      icon
    }
  }
`;

const MessageBoxConfig: FunctionComponent = () => (
  <HorizontalGutter size="oneAndAHalf">
    <Field name="messageBox.icon" parse={parseEmptyAsNull} format={formatEmpty}>
      {({ input: iconInput }) => (
        <Field name="messageBox.content" parse={parseWithDOMPurify}>
          {({ input: contentInput, meta }) => (
            <>
              <HorizontalGutter size="half" container="section">
                <Localized id="configure-messageBox-preview">
                  <Typography
                    variant="bodyCopyBold"
                    container="h1"
                    className={styles.preview}
                  >
                    PREVIEW
                  </Typography>
                </Localized>
                <MessageBox className={CLASSES.configureMessageBox.messageBox}>
                  {iconInput.value && (
                    <MessageBoxIcon>{iconInput.value}</MessageBoxIcon>
                  )}
                  {/* Using a zero width join character to ensure that the space is used */}
                  <MessageBoxContent
                    className={
                      iconInput.value ? styles.withIcon : styles.withoutIcon
                    }
                  >
                    {contentInput.value || "&nbsp;"}
                  </MessageBoxContent>
                </MessageBox>
              </HorizontalGutter>
              <HorizontalGutter size="half" container="fieldset">
                <Localized id="configure-messageBox-selectAnIcon">
                  <Typography variant="bodyCopyBold" container="legend">
                    Select an Icon
                  </Typography>
                </Localized>
                <TileSelector
                  id="configure-messageBox-icon"
                  name={iconInput.name}
                  onChange={iconInput.onChange}
                  value={iconInput.value}
                >
                  <TileOption
                    className={CLASSES.configureMessageBox.option}
                    value="question_answer"
                  >
                    <Icon size="md">question_answer</Icon>
                    <Localized id="configure-messageBox-iconConversation">
                      <AriaInfo>Conversation</AriaInfo>
                    </Localized>
                  </TileOption>
                  <TileOption
                    className={CLASSES.configureMessageBox.option}
                    value="today"
                  >
                    <Icon size="md">today</Icon>
                    <Localized id="configure-messageBox-iconDate">
                      <AriaInfo>Date</AriaInfo>
                    </Localized>
                  </TileOption>
                  <TileOption
                    className={CLASSES.configureMessageBox.option}
                    value="help_outline"
                  >
                    <Icon size="md">help_outline</Icon>
                    <Localized id="configure-messageBox-iconHelp">
                      <AriaInfo>Help</AriaInfo>
                    </Localized>
                  </TileOption>
                  <TileOption
                    className={CLASSES.configureMessageBox.option}
                    value="warning"
                  >
                    <Icon size="md">warning</Icon>
                    <Localized id="configure-messageBox-iconWarning">
                      <AriaInfo>Warning</AriaInfo>
                    </Localized>
                  </TileOption>
                  <TileOption
                    className={CLASSES.configureMessageBox.option}
                    value="chat_bubble_outline"
                  >
                    <Icon size="md">chat_bubble_outline</Icon>
                    <Localized id="configure-messageBox-iconChatBubble">
                      <AriaInfo>Chat Bubble</AriaInfo>
                    </Localized>
                  </TileOption>
                  <TileOption
                    className={CLASSES.configureMessageBox.option}
                    value=""
                  >
                    <Localized id="configure-messageBox-noIcon">
                      <span>No Icon</span>
                    </Localized>
                  </TileOption>
                </TileSelector>
              </HorizontalGutter>
              <HorizontalGutter size="half" container="section">
                <div>
                  <Localized id="configure-messageBox-writeAMessage">
                    <Typography
                      variant="bodyCopyBold"
                      container={
                        <label htmlFor="configure-messageBox-content" />
                      }
                    >
                      Write a Message
                    </Typography>
                  </Localized>
                </div>
                <Suspense fallback={<Spinner />}>
                  <MarkdownEditor
                    id="configure-messageBox-content"
                    /* eslint-disable-next-line jsx-a11y/no-autofocus*/
                    autoFocus={true}
                    data-testid="configure-messageBox-content"
                    name={contentInput.name}
                    onChange={contentInput.onChange}
                    value={contentInput.value}
                  />
                </Suspense>
                <FieldValidationMessage meta={meta} />
              </HorizontalGutter>
            </>
          )}
        </Field>
      )}
    </Field>
  </HorizontalGutter>
);

export default MessageBoxConfig;
