import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { StaffConfigContainer_settings as SettingsData } from "coral-admin/__generated__/StaffConfigContainer_settings.graphql";
import { required } from "coral-framework/lib/validation";
import {
  FieldSet,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  Tag,
  TextField,
  Typography,
} from "coral-ui/components";

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
      <Header container="legend">Staff member badge</Header>
    </Localized>
    <SectionContent>
      <Localized id="configure-general-staff-explanation">
        <Typography variant="bodyShort">
          Show a custom badge for staff members of your organization. This badge
          appears on the comment stream and in the admin interface.
        </Typography>
      </Localized>
      <HorizontalGutter size="double">
        <FormField>
          <Field name="staff.label" validate={required}>
            {({ input, meta }) => (
              <Flex itemGutter="double">
                <HorizontalGutter>
                  <Localized id="configure-general-staff-label">
                    <InputLabel>Badge text</InputLabel>
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
                    <Typography variant="heading3">Preview</Typography>
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
