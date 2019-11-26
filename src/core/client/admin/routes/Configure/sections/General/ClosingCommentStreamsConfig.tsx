import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  DURATION_UNIT,
  DurationField,
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const ClosingCommentStreamsConfig: FunctionComponent<Props> = ({
  disabled,
}) => (
  <ConfigBox
    title={
      <Localized id="configure-general-closingCommentStreams-title">
        <Header container={<legend />}>Closing comment streams</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized
      id="configure-general-closingCommentStreams-explanation"
      strong={<strong />}
    >
      <FormFieldDescription>
        Set comment streams to close after a defined period of time after a
        story’s publication
      </FormFieldDescription>
    </Localized>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-closingCommentStreams-closeCommentsAutomatically">
        <Label component="legend">Close comments automatically</Label>
      </Localized>
      <OnOffField name="closeCommenting.auto" disabled={disabled} />
    </FormField>
    <FormField container={<FieldSet />}>
      <Localized id="configure-general-closingCommentStreams-closeCommentsAfter">
        <Label component="legend">Close comments after</Label>
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
              color={colorFromMeta(meta)}
              {...input}
            />
            <ValidationMessage meta={meta} fullWidth />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default ClosingCommentStreamsConfig;
