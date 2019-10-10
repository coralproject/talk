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
        <Header container="legend">New commenter approval</Header>
      </Localized>
      <Localized id="configure-moderation-newCommenters-description">
        <Typography variant="bodyShort">
          When this is active, initial comments by a new commenter will be sent
          to Pending for moderator approval before publication.
        </Typography>
      </Localized>
      <SectionContent>
        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-newCommenters-enable">
            <InputLabel container="legend">
              Enable new commenter approval
            </InputLabel>
          </Localized>
          <OnOffField name="newCommenters.premodEnabled" disabled={disabled} />
        </FormField>
        <FormField>
          <Localized id="configure-moderation-newCommenters-approvedCommentsThreshold">
            <InputLabel>Number of first comments sent for approval</InputLabel>
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
