// import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { required } from "coral-framework/lib/validation";
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

import styles from "./UserProfileConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment UserProfileConfig_formValues on Settings {
    publicProfileURL
  }
`;

interface Props {
  disabled: boolean;
}

const UserProfileConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      // TODO: Localization
      // <Localized id="configure-general-staff-title">
      <Header container={<legend />}>Public user profile link</Header>
      // </Localized>
    }
    container={<FieldSet />}
  >
    {/* <Localized id="configure-general-staff-explanation"> */}
    <FormFieldDescription>
      External link to a user's public profile. May contain $USER_NAME to
      replace with username or $USER_ID to replace with user ID.
    </FormFieldDescription>
    {/* </Localized> */}
    {/* TODO: Add more validation */}
    <Field name="publicProfileURL" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            {/* <Localized id="configure-general-staff-admin-label"> */}
            <Label>Public user profile URL pattern</Label>
            {/* </Localized> */}
            {/* <Localized id="configure-general-staff-admin-input"> */}
            <TextFieldWithValidation
              {...input}
              // TODO: update styles to make wider to better fit placeholder
              className={styles.textInput}
              id={input.name}
              type="text"
              fullWidth
              placeholder="https://sbnation.com/user/$USER_NAME"
              disabled={disabled}
              meta={meta}
            />
            {/* </Localized> */}
          </FormField>
        </Flex>
      )}
    </Field>
  </ConfigBox>
);

export default UserProfileConfig;
