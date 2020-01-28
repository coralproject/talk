import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, FormSpy } from "react-final-form";

import { colorFromMeta, parseEmptyAsNull } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  Button,
  DURATION_UNIT,
  DurationField,
  Flex,
  FieldSet,
  FormField,
  FormFieldHeader,
  Label,
  Textarea,
} from "coral-ui/components/v2";

import ValidationMessage from "../../ValidationMessage";

// import styles from "./AnnouncementConfig.css";

interface Announcement {
  content: string;
  duration: number;
  createdAt?: Date;
  disableAt?: Date;
}

interface Settings {
  announcement: Announcement | null;
}

interface Props {
  settings: Settings;
  onSubmit: (values: any) => void;
  disabled: boolean;
  onClose: () => void;
}

const AnnouncementForm: FunctionComponent<Props> = ({
  settings,
  onSubmit,
  disabled,
  onClose,
}) => {
  const [values, setValues] = useState<{} | null>(null);
  const onButtonClick = useCallback(() => {
    if (!values) {
      return;
    }
    if (onSubmit && !disabled && !values.hasValidationErrors) {
      onSubmit(values.values);
    }
  }, [values]);
  return (
    <>
      <FormSpy
        subscription={{ values: true, hasValidationErrors: true }}
        onChange={v => setValues(v)}
      />
      <FormField>
        <FormFieldHeader>
          <Localized id="configure-general-announcement-title">
            <Label htmlFor="configure-general-announcement-content">
              Announcement text
            </Label>
          </Localized>
        </FormFieldHeader>

        <Field
          name="announcement.content"
          parse={parseEmptyAsNull}
          validate={required}
          defaultValue={
            settings.announcement ? settings.announcement.content : ""
          }
        >
          {({ input, meta }) => (
            <>
              <Textarea
                {...input}
                fullwidth
                id="configure-general-announcement-content"
              />
              <ValidationMessage meta={meta} />
            </>
          )}
        </Field>
      </FormField>
      <FormField container={<FieldSet />}>
        <Localized id="configure-general-announcement-duration">
          <Label component="legend">Show this announcement for</Label>
        </Localized>

        <Field
          name="announcement.duration"
          defaultValue="86400"
          validate={composeValidators(
            required,
            validateWholeNumberGreaterThan(0)
          )}
        >
          {({ input, meta }) => (
            <>
              <DurationField
                {...input}
                units={[
                  DURATION_UNIT.HOUR,
                  DURATION_UNIT.DAY,
                  DURATION_UNIT.WEEK,
                ]}
                disabled={disabled}
                color={colorFromMeta(meta)}
              />
              <ValidationMessage meta={meta} fullWidth />
            </>
          )}
        </Field>
      </FormField>
      <Flex itemGutter justifyContent="flex-end">
        <Localized id="configure-general-announcement-cancel">
          <Button color="mono" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </Localized>
        <Localized id="configure-general-announcement-start">
          <Button onClick={onButtonClick}>Start announcement</Button>
        </Localized>
      </Flex>
    </>
  );
};

export default AnnouncementForm;
