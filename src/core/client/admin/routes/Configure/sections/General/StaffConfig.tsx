import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { required } from "coral-framework/lib/validation";
import {
  FieldSet,
  Flex,
  FormField,
  FormFieldDescription,
  HorizontalGutter,
  Label,
  Tag,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import TextFieldWithValidation from "../../TextFieldWithValidation";

import styles from "./StaffConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment StaffConfig_formValues on Settings {
    badges {
      staffLabel
      adminLabel
      moderatorLabel
    }
  }
`;

interface Props {
  disabled: boolean;
}

const StaffConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-staff-title">
        <Header container={<legend />}>Staff member badge</Header>
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
    <Field name="staff.adminLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-staff-admin-label">
              <Label>Admin badge text</Label>
            </Localized>
            <Localized id="configure-general-staff-admin-input">
              <TextFieldWithValidation
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Staff"
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-staff-admin-preview">
              <Label component="p">Preview</Label>
            </Localized>
            {input.value && <Tag>{input.value}</Tag>}
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
    <Field name="staff.moderatorLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-staff-moderator-label">
              <Label>Moderator badge text</Label>
            </Localized>
            <Localized id="configure-general-staff-moderator-input">
              <TextFieldWithValidation
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Staff"
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-staff-moderator-preview">
              <Label component="p">Preview</Label>
            </Localized>
            {input.value && <Tag>{input.value}</Tag>}
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
    <Field name="staff.staffLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-staff-member-label">
              <Label>Staff member badge text</Label>
            </Localized>
            <Localized id="configure-general-staff-input">
              <TextFieldWithValidation
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Staff"
                disabled={disabled}
                meta={meta}
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
