import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  DURATION_UNIT,
  DurationField,
  FormField,
  Label,
} from "coral-admin/ui/components";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
} from "coral-framework/lib/validation";
import { FieldSet, HorizontalGutter } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const CommentEditingConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter spacing={3}>
    <Localized id="configure-general-commentEditing-title">
      <Header>Comment editing</Header>
    </Localized>
    <SectionContent>
      <Localized
        id="configure-general-commentEditing-explanation"
        strong={<strong />}
      >
        <Description>
          Set a limit on how long commenters have to edit their comments
          sitewide. Edited comments are marked as (Edited) on the comment stream
          and the moderation panel.
        </Description>
      </Localized>

      <FormField container={<FieldSet />}>
        <Localized id="configure-general-commentEditing-commentEditTimeFrame">
          <Label component="legend">Comment edit timeframe</Label>
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
    </SectionContent>
  </HorizontalGutter>
);

export default CommentEditingConfig;
