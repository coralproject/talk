import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { formatEmpty, parseEmptyAsNull } from "coral-framework/lib/form";
import { validateStringTemplate } from "coral-framework/lib/validation";
import {
  FieldSet,
  Flex,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./ExternalLinksConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ExternalLinksConfig_formValues on Settings {
    externalProfileURL
  }
`;

interface Props {
  disabled: boolean;
}

const ExternalLinksConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-moderation-externalLinks-title">
        <Header container={<legend />}>External links for moderators</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized id="configure-moderation-externalLinks-profile-explanation">
      <FormFieldDescription>
        When a URL format is included below, external profile links are added to
        the user drawer inside the moderation interface. You can use the format
        $USER_NAME to insert the username or $USER_ID to insert the user’s
        unique ID number.
      </FormFieldDescription>
    </Localized>
    <Field
      name="externalProfileURL"
      parse={parseEmptyAsNull}
      format={formatEmpty}
      validate={validateStringTemplate(["USER_NAME", "USER_ID"])}
    >
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-moderation-externalLinks-profile-label">
              <Label>External profile URL pattern</Label>
            </Localized>
            <Localized id="configure-moderation-externalLinks-profile-input">
              <TextFieldWithValidation
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="https://example.com/users/$USER_NAME"
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
        </Flex>
      )}
    </Field>
  </ConfigBox>
);

export default ExternalLinksConfig;
