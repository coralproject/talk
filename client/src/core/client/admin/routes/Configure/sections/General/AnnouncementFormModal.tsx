import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";

import {
  colorFromMeta,
  parseEmptyAsNull,
  parseInteger,
} from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateWholeNumberGreaterThan,
} from "coral-framework/lib/validation";
import {
  Button,
  Card,
  CardCloseButton,
  DURATION_UNIT,
  DurationField,
  FieldSet,
  Flex,
  FormField,
  FormFieldHeader,
  HorizontalGutter,
  Label,
  Modal,
  ModalProps,
  Textarea,
} from "coral-ui/components/v2";

import ValidationMessage from "../../ValidationMessage";

import styles from "./AnnouncementFormModal.css";

interface Props extends Partial<ModalProps> {
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const AnnouncementForm: FunctionComponent<Props> = ({
  onSubmit,
  onClose,
  ...rest
}) => {
  return (
    <Modal {...rest}>
      {({ firstFocusableRef }) => (
        <Card className={styles.root}>
          <Flex justifyContent="flex-end">
            <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
          </Flex>
          <Form
            onSubmit={onSubmit}
            initialValues={{ content: "", duration: 86400 }}
          >
            {({ handleSubmit, submitting, submitError }) => (
              <form
                autoComplete="off"
                onSubmit={handleSubmit}
                id="announcements-form"
              >
                <HorizontalGutter spacing={4}>
                  <HorizontalGutter spacing={3}>
                    <FormField>
                      <FormFieldHeader>
                        <Localized id="configure-general-announcements-title">
                          <Label htmlFor="configure-general-announcements-content">
                            Announcement text
                          </Label>
                        </Localized>
                      </FormFieldHeader>

                      <Field
                        name="content"
                        parse={parseEmptyAsNull}
                        validate={required}
                      >
                        {({ input, meta }) => (
                          <>
                            <Textarea
                              {...input}
                              fullwidth
                              id="configure-general-announcements-content"
                            />
                            <ValidationMessage meta={meta} fullWidth />
                          </>
                        )}
                      </Field>
                    </FormField>
                    <FormField container={<FieldSet />}>
                      <Localized id="configure-general-announcements-duration">
                        <Label component="legend">
                          Show this announcement for
                        </Label>
                      </Localized>

                      <Field
                        name="duration"
                        validate={composeValidators(
                          required,
                          validateWholeNumberGreaterThan(0)
                        )}
                        parse={parseInteger}
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
                              color={colorFromMeta(meta)}
                            />
                            <ValidationMessage meta={meta} fullWidth />
                          </>
                        )}
                      </Field>
                    </FormField>
                  </HorizontalGutter>
                  <Flex itemGutter justifyContent="flex-end">
                    <Localized id="configure-general-announcements-cancel">
                      <Button color="mono" variant="outlined" onClick={onClose}>
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="configure-general-announcements-start">
                      <Button type="submit">Start announcement</Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
              </form>
            )}
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default AnnouncementForm;
