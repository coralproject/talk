import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { colorFromMeta, parseInteger } from "coral-framework/lib/form";
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

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ClosingCommentStreamsConfig_formValues on Settings {
    closeCommenting {
      auto
      timeout
    }
  }
`;

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
    data-testid="closing-comment-streams-config-box"
  >
    <Localized
      id="configure-general-closingCommentStreams-explanation"
      elems={{ strong: <strong /> }}
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
      <OnOffField
        name="closeCommenting.auto"
        disabled={disabled}
        testIDs={{
          on: "close-commenting-streams-on",
          off: "close-commenting-streams-off",
        }}
      />
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
        parse={parseInteger}
      >
        {({ input, meta }) => (
          <>
            <DurationField
              {...input}
              units={[
                DURATION_UNIT.HOUR,
                DURATION_UNIT.DAY,
                DURATION_UNIT.WEEK,
              ]}
              disabled={disabled}
              color={colorFromMeta(meta)}
            />
            <ValidationMessage meta={meta} fullWidth />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default ClosingCommentStreamsConfig;
