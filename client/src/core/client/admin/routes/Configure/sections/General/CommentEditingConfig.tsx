import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { colorFromMeta, parseInteger } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThanOrEqual,
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
import ValidationMessage from "../../ValidationMessage";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CommentEditingConfig_formValues on Settings {
    editCommentWindowLength
  }
`;
interface Props {
  disabled: boolean;
}

const CommentEditingConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    data-testid="comment-editing-config-box"
    title={
      <Localized id="configure-general-commentEditing-title">
        <Header container="h2">Comment editing</Header>
      </Localized>
    }
  >
    <Localized
      id="configure-general-commentEditing-explanation"
      elems={{ strong: <strong /> }}
    >
      <FormFieldDescription>
        Set a limit on how long commenters have to edit their comments sitewide.
        Edited comments are marked as (Edited) on the comment stream and the
        moderation panel.
      </FormFieldDescription>
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
        parse={parseInteger}
      >
        {({ input, meta }) => (
          <>
            <DurationField
              {...input}
              units={[
                DURATION_UNIT.SECOND,
                DURATION_UNIT.MINUTE,
                DURATION_UNIT.HOUR,
              ]}
              color={colorFromMeta(meta)}
              disabled={disabled}
            />
            <ValidationMessage meta={meta} fullWidth />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default CommentEditingConfig;
