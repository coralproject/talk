import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { DURATION_UNIT, DurationField } from "coral-framework/components";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const CommentEditingConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-commentEditing-title">
      <Header>Comment editing</Header>
    </Localized>
    <Localized
      id="configure-general-commentEditing-explanation"
      strong={<strong />}
    >
      <Typography variant="bodyShort">
        Set a limit on how long commenters have to edit their comments sitewide.
        Edited comments are marked as (Edited) on the comment stream and the
        moderation panel.
      </Typography>
    </Localized>

    <FormField container={<FieldSet />}>
      <Localized id="configure-general-commentEditing-commentEditTimeFrame">
        <InputLabel container="legend">Comment edit timeframe</InputLabel>
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
              disabled={disabled}
              {...input}
            />
            <ValidationMessage meta={meta} />
          </>
        )}
      </Field>
    </FormField>
  </HorizontalGutter>
);

export default CommentEditingConfig;
