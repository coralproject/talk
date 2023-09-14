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

import styles from "./BadgeConfig.css";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment BadgeConfig_formValues on Settings {
    badges {
      staffLabel
      adminLabel
      moderatorLabel
      memberLabel
    }
  }
`;

interface Props {
  disabled: boolean;
}

const StaffConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-badges-title">
        <Header container={<legend />}>Member badges</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized id="configure-general-badges-explanation">
      <FormFieldDescription>
        Show a custom badge for users with specified roles. This badge appears
        on the comment stream and in the admin interface.
      </FormFieldDescription>
    </Localized>
    <Field name="badges.adminLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-badges-admin-label">
              <Label>Admin badge text</Label>
            </Localized>
            <Localized
              id="configure-general-badges-admin-input"
              attrs={{ placeholder: true }}
            >
              <TextFieldWithValidation
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Admin"
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-badges-preview">
              <Label component="p">Preview</Label>
            </Localized>
            {input.value && <Tag>{input.value}</Tag>}
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
    <Field name="badges.moderatorLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-badges-moderator-label">
              <Label>Moderator badge text</Label>
            </Localized>
            <Localized
              id="configure-general-badges-moderator-input"
              attrs={{ placeholder: true }}
            >
              <TextFieldWithValidation
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Moderator"
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-badges-preview">
              <Label component="p">Preview</Label>
            </Localized>
            {input.value && <Tag>{input.value}</Tag>}
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
    <Field name="badges.staffLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-badges-staff-member-label">
              <Label>Staff member badge text</Label>
            </Localized>
            <Localized
              id="configure-general-badges-staff-member-input"
              attrs={{ placeholder: true }}
            >
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
            <Localized id="configure-general-badges-preview">
              <Label component="p">Preview</Label>
            </Localized>
            {input.value && <Tag>{input.value}</Tag>}
          </HorizontalGutter>
        </Flex>
      )}
    </Field>
    <Field name="badges.memberLabel" validate={required}>
      {({ input, meta }) => (
        <Flex itemGutter="double">
          <FormField>
            <Localized id="configure-general-badges-member-label">
              <Label>Member badge text</Label>
            </Localized>
            <Localized
              id="configure-general-badges-member-input"
              attrs={{ placeholder: true }}
            >
              <TextFieldWithValidation
                {...input}
                className={styles.textInput}
                id={input.name}
                type="text"
                fullWidth
                placeholder="E.g. Member"
                disabled={disabled}
                meta={meta}
              />
            </Localized>
          </FormField>
          <HorizontalGutter>
            <Localized id="configure-general-badges-preview">
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
