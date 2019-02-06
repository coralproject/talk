import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import {
  FormField,
  HorizontalGutter,
  InputLabel,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import { Field } from "react-final-form";
import OnOffField from "talk-admin/routes/configure/components/OnOffField";
import {
  composeValidators,
  required,
  validatePositiveWholeNumber,
} from "talk-framework/lib/validation";

import Header from "../../../components/Header";
import DurationField from "./DurationField";

interface Props {
  disabled: boolean;
}

const ClosingCommentStreamsConfig: StatelessComponent<Props> = ({
  disabled,
}) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-closingCommentStreams-title">
      <Header>Closing Comment Streams</Header>
    </Localized>
    <Localized
      id="configure-general-closingCommentStreams-explanation"
      strong={<strong />}
    >
      <Typography variant="detail">
        Set comment streams to close after a defined period of time after an
        story’s publication
      </Typography>
    </Localized>
    <FormField>
      <Localized id="configure-general-closingCommentStreams-closeCommentsAutomatically">
        <InputLabel>Close Comments Automatically</InputLabel>
      </Localized>
      <OnOffField name="autoCloseStream" disabled={disabled} />
    </FormField>
    <FormField>
      <Localized id="configure-general-closingCommentStreams-closeCommentsAfter">
        <InputLabel>Close Comments After</InputLabel>
      </Localized>

      <Field
        name="closedTimeout"
        validate={composeValidators(required, validatePositiveWholeNumber)}
      >
        {({ input, meta }) => (
          <>
            <DurationField
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
            />
            {meta.touched &&
              (meta.error || meta.submitError) && (
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

export default ClosingCommentStreamsConfig;
