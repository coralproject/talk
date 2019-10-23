import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  DURATION_UNIT,
  DurationField,
  FieldSet,
  FormField,
  Label,
} from "coral-admin/ui/components";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";

import ConfigBox from "../../ConfigBox";
import Description from "../../Description";
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
        <Header component="legend">Closing comment streams</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized
      id="configure-general-closingCommentStreams-explanation"
      strong={<strong />}
    >
      <Description>
        Set comment streams to close after a defined period of time after a
        story’s publication
      </Description>
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
              {...input}
            />
            <ValidationMessage meta={meta} />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default ClosingCommentStreamsConfig;
