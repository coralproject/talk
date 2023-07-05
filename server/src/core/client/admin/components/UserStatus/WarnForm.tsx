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

const WarnForm: FunctionComponent<Props> = ({
  onCancel,
  onSubmit,
  lastFocusableRef,
}) => {
  const onFormSubmit = useCallback(
    ({ message }: { message: string }) => {
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
                  <Localized id="community-warnModal-message-label">
                    <Label className={styles.label}>Message</Label>
                  </Localized>
                  <Localized id="community-warnModal-message-required">
                    <span className={styles.required}>Required</span>
                  </Localized>
                </Flex>
                <Localized id="community-warnModal-message-description">
                  <HelperText>
                    Explain to this user how they should change their behavior
                    on your site.
                  </HelperText>
                </Localized>
              </HorizontalGutter>
              <Field component="textarea" name="message" validate={required}>
                {({ input }) => (
                  <Textarea id="warnModal-message" {...input} fullwidth />
                )}
              </Field>
              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-warnModal-cancel">
                  <Button variant="flat" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
                <Localized id="community-warnModal-warnUser">
                  <Button
                    ref={lastFocusableRef}
                    type="submit"
                    disabled={invalid}
                  >
                    Warn User
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

export default WarnForm;
