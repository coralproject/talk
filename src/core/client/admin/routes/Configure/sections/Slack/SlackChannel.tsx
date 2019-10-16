import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import { CheckBox, InputLabel, TextField } from "coral-ui/components";

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
  return (
    <>
      <hr />
      <InputLabel container="legend">{`Channel ${index}`}</InputLabel>
      <Field name={`${channel}.enabled`} type="checkbox" parse={parseBool}>
        {({ input }) => (
          <CheckBox
            id={`configure-slack-channel-enabled-${input.name}`}
            disabled={disabled}
            {...input}
          >
            Enabled
          </CheckBox>
        )}
      </Field>
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
