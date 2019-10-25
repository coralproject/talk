import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { required } from "coral-framework/lib/validation";
import { Flex, HorizontalGutter, Tag } from "coral-ui/components";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  Label,
} from "coral-ui/components/v2";

import { StaffConfigContainer_settings as SettingsData } from "coral-admin/__generated__/StaffConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./StaffConfig.css";

interface Props {
  disabled: boolean;
  settings: SettingsData;
}

const StaffConfig: FunctionComponent<Props> = ({ disabled, settings }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-staff-title">
        <Header component="legend">Staff member badge</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized id="configure-general-staff-explanation">
      <FormFieldDescription>
        Show a custom badge for staff members of your organization. This badge
        appears on the comment stream and in the admin interface.
      </FormFieldDescription>
    </Localized>
    <Field name="staff.label" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-staff-label">
              <Label>Badge text</Label>
            </Localized>
            <Localized id="configure-general-staff-input">
              <TextFieldWithValidation
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Staff"
                disabled={disabled}
                meta={meta}
                {...input}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-staff-preview">
              <Label component="p">Preview</Label>
            </Localized>
            {input.value && <Tag>{input.value}</Tag>}
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
  </ConfigBox>
);

export default StaffConfig;
