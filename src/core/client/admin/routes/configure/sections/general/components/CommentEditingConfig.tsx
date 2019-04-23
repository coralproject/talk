import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { DURATION_UNIT, DurationField } from "talk-framework/components";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "talk-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import Header from "../../../components/Header";

interface Props {
  disabled: boolean;
}

const CommentEditingConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-commentEditing-title">
      <Header>Comment Editing</Header>
    </Localized>
    <Localized
      id="configure-general-commentEditing-explanation"
      strong={<strong />}
    >
      <Typography variant="detail">
        Set a limit on how long commenters have to edit their comments sitewide.
        Edited comments are marked as (Edited) on the comment stream and the
        moderation panel.
      </Typography>
    </Localized>

    <FormField container={<FieldSet />}>
      <Localized id="configure-general-commentEditing-commentEditTimeFrame">
        <InputLabel container="legend">Comment Edit Timeframe</InputLabel>
      </Localized>
      <Field
        name="editCommentWindowLength"
        validate={composeValidators(
          required,
          validateWholeNumberGreaterThanOrEqual(0)
        )}
      >
        {({ input, meta }) => (
          <>
            <DurationField
              units={[
                DURATION_UNIT.SECONDS,
                DURATION_UNIT.MINUTES,
                DURATION_UNIT.HOURS,
              ]}
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
            />
            {meta.touched && (meta.error || meta.submitError) && (
              <ValidationMessage>
                {meta.error || meta.submitError}
              </ValidationMessage>
            )}
          </>
        )}
      </Field>
    </FormField>
  </HorizontalGutter>
);

export default CommentEditingConfig;
