import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { DURATION_UNIT, DurationField } from "coral-framework/components";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import OnOffField from "../../OnOffField";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const ClosingCommentStreamsConfig: FunctionComponent<Props> = ({
  disabled,
}) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <Localized id="configure-general-closingCommentStreams-title">
      <Header container="legend">Closing Comment Streams</Header>
    </Localized>
    <Localized
      id="configure-general-closingCommentStreams-explanation"
      strong={<strong />}
    >
      <Typography variant="bodyCopy">
        Set comment streams to close after a defined period of time after a
        story’s publication
      </Typography>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-closingCommentStreams-closeCommentsAutomatically">
        <InputLabel container="legend">Close Comments Automatically</InputLabel>
      </Localized>
      <OnOffField name="closeCommenting.auto" disabled={disabled} />
    </FormField>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-closingCommentStreams-closeCommentsAfter">
        <InputLabel container="legend">Close Comments After</InputLabel>
      </Localized>

      <Field
        name="closeCommenting.timeout"
        validate={composeValidators(
          required,
          validateWholeNumberGreaterThan(0)
        )}
      >
        {({ input, meta }) => (
          <>
            <DurationField
              units={[
                DURATION_UNIT.HOURS,
                DURATION_UNIT.DAYS,
                DURATION_UNIT.WEEKS,
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

export default ClosingCommentStreamsConfig;
