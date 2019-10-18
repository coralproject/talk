import React, { FunctionComponent, useCallback } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import {
  Button,
  CheckBox,
  Flex,
  InputLabel,
  TextField,
} from "coral-ui/components";

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
      <hr />
      <InputLabel className={styles.header} container="legend">
        {`Channel ${index}`}
      </InputLabel>
      <div className={styles.headerControls}>
        <Flex justifyContent="center" alignItems="center">
          <Field name={`${channel}.enabled`} type="checkbox" parse={parseBool}>
            {({ input }) => (
              <CheckBox
                className={styles.enabledCheckbox}
                id={`configure-slack-channel-enabled-${input.name}`}
                disabled={disabled}
                {...input}
              >
                Enabled
              </CheckBox>
            )}
          </Field>
          <Button
            className={styles.removeButton}
            variant="filled"
            color="error"
            onClick={onRemove}
          >
            Remove
          </Button>
        </Flex>
      </div>
      <Field name={`${channel}.hookURL`}>
        {({ input, meta }) => (
          <>
            <InputLabel container="legend">URL</InputLabel>
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
      <InputLabel container="legend">Triggers</InputLabel>
      <Field
        name={`${channel}.triggers.allComments`}
        type="checkbox"
        parse={parseBool}
      >
        {({ input }) => (
          <CheckBox
            id={`configure-slack-channel-triggers-allComments-${input.name}`}
            disabled={disabled}
            {...input}
          >
            All Comments
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
            id={`configure-slack-channel-triggers-allComments-${input.name}`}
            disabled={disabled}
            {...input}
          >
            Reported Comments
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
            id={`configure-slack-channel-triggers-allComments-${input.name}`}
            disabled={disabled}
            {...input}
          >
            Pending Comments
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
            id={`configure-slack-channel-triggers-allComments-${input.name}`}
            disabled={disabled}
            {...input}
          >
            Featured Comments
          </CheckBox>
        )}
      </Field>
    </>
  );
};

export default SlackChannel;
