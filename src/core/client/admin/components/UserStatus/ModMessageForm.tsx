import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, RefObject, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { required } from "coral-framework/lib/validation";
import {
  Button,
  Flex,
  HelperText,
  HorizontalGutter,
  Label,
  Textarea,
} from "coral-ui/components/v2";

import styles from "./WarnForm.css";

interface Props {
  onCancel: () => void;
  onSubmit: (message: string) => void;
  lastFocusableRef: RefObject<any>;
}

const ModMessageForm: FunctionComponent<Props> = ({
  onCancel,
  onSubmit,
  lastFocusableRef,
}) => {
  const onFormSubmit = useCallback(
    ({ message }) => {
      onSubmit(message);
    },
    [onSubmit]
  );

  return (
    <>
      <Form onSubmit={onFormSubmit}>
        {({ handleSubmit, invalid, form }) => (
          <form onSubmit={handleSubmit}>
            <HorizontalGutter spacing={3}>
              <HorizontalGutter spacing={1}>
                <Flex alignItems="baseline" spacing={1}>
                  {/* TODO: Add this id to localization */}
                  <Localized id="community-messageModal-message-label">
                    <Label className={styles.label}>Message</Label>
                  </Localized>
                  {/* TODO: Add this id to localization */}
                  <Localized id="community-messageModal-message-required">
                    <span className={styles.required}>Required</span>
                  </Localized>
                </Flex>
                {/* TODO: Add this id to localization */}
                <Localized id="community-messageModal-message-description">
                  <HelperText>
                    Explain to this user how they should change their behavior
                    on your site.
                  </HelperText>
                </Localized>
              </HorizontalGutter>
              <Field component="textarea" name="message" validate={required}>
                {({ input }) => (
                  // TODO: Add this id to localization
                  <Textarea id="messageModal-message" {...input} fullwidth />
                )}
              </Field>
              <Flex justifyContent="flex-end" itemGutter="half">
                {/* TODO: Add this id to localization */}
                <Localized id="community-messageModal-cancel">
                  <Button variant="flat" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
                {/* TODO: Add this id to localization */}
                <Localized id="community-messageModal-messageUser">
                  <Button
                    ref={lastFocusableRef}
                    type="submit"
                    disabled={invalid}
                  >
                    Message User
                  </Button>
                </Localized>
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </>
  );
};

export default ModMessageForm;
