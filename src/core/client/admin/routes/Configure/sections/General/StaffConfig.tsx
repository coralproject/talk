import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FieldSet,
  FormField,
  Label,
  TextField,
} from "coral-admin/ui/components";
import { required } from "coral-framework/lib/validation";
import { Flex, HorizontalGutter, Tag } from "coral-ui/components";

import { StaffConfigContainer_settings as SettingsData } from "coral-admin/__generated__/StaffConfigContainer_settings.graphql";

import Description from "../../Description";
import Header from "../../Header";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

import styles from "./StaffConfig.css";

interface Props {
  disabled: boolean;
  settings: SettingsData;
}

const StaffConfig: FunctionComponent<Props> = ({ disabled, settings }) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <Localized id="configure-general-staff-title">
      <Header component="legend">Staff member badge</Header>
    </Localized>
    <SectionContent>
      <Localized id="configure-general-staff-explanation">
        <Description>
          Show a custom badge for staff members of your organization. This badge
          appears on the comment stream and in the admin interface.
        </Description>
      </Localized>
      <HorizontalGutter size="double">
        <FormField>
          <Field name="staff.label" validate={required}>
            {({ input, meta }) => (
              <Flex itemGutter="double">
                <HorizontalGutter>
                  <Localized id="configure-general-staff-label">
                    <Label>Badge text</Label>
                  </Localized>
                  <Localized id="configure-general-staff-input">
                    <TextField
                      className={styles.textInput}
                      id={input.name}
                      type="text"
                      fullWidth
                      placeholder="E.g. Staff"
                      disabled={disabled}
                      {...input}
                    />
                  </Localized>
                  <ValidationMessage fullWidth meta={meta} />
                </HorizontalGutter>
                <HorizontalGutter>
                  <Localized id="configure-general-staff-preview">
                    <Label component="p">Preview</Label>
                  </Localized>
                  {input.value && <Tag>{input.value}</Tag>}
                </HorizontalGutter>
              </Flex>
            )}
          </Field>
        </FormField>
      </HorizontalGutter>
    </SectionContent>
  </HorizontalGutter>
);

export default StaffConfig;
