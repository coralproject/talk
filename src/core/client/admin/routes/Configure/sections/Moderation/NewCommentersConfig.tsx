import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import OnOffField from "../../OnOffField";
import SectionContent from "../../SectionContent";

import styles from "./NewCommentersConfig.css";

interface Props {
  disabled: boolean;
}

const NewCommentersConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
      <Localized id="configure-moderation-newCommenters-title">
        <Header container="legend">New Commenters</Header>
      </Localized>
      <SectionContent>
        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-newCommenters-enabled">
            <InputLabel container="legend">Enable pre-moderation</InputLabel>
          </Localized>
          <Localized
            id="configure-moderation-newCommenters-enabled-description"
            strong={<strong />}
          >
            <InputDescription>
              Enforce premoderation for new commenters
            </InputDescription>
          </Localized>
          <OnOffField name="newCommenters.premodEnabled" disabled={disabled} />
        </FormField>
        <FormField>
          <Localized id="configure-moderation-newCommenters-approvedCommentsThreshold">
            <InputLabel>Approved comments threshold</InputLabel>
          </Localized>
          <Localized id="configure-moderation-newCommenters-approvedCommentsThreshold-description">
            <InputDescription>
              The number of comments a user must have approved before they do
              not have to be premoderated
            </InputDescription>
          </Localized>
          <Field
            name="newCommenters.approvedCommentsThreshold"
            validate={composeValidators(
              required,
              validateWholeNumberGreaterThan(1)
            )}
          >
            {({ input, meta }) => (
              <>
                <TextField
                  classes={{
                    input: styles.thresholdTextField,
                  }}
                  disabled={disabled}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  textAlignCenter
                  adornment={
                    <Localized id="configure-moderation-newCommenters-comments">
                      <Typography variant="bodyShort">comments</Typography>
                    </Localized>
                  }
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
};

export default NewCommentersConfig;
