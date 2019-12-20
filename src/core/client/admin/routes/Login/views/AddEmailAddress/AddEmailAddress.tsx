import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Form } from "react-final-form";

import { FormError, OnSubmit } from "coral-framework/lib/form";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import CompleteAccountBox from "../../CompleteAccountBox";
import ConfirmEmailField from "./ConfirmEmailField";
import EmailField from "./EmailField";

interface FormProps {
  email: string;
}

interface FormSubmitProps extends FormProps, FormError {}

export interface AddEmailAddressForm {
  onSubmit: OnSubmit<FormSubmitProps>;
}

const AddEmailAddress: FunctionComponent<AddEmailAddressForm> = props => {
  return (
    <CompleteAccountBox
      title={
        <Localized id="addEmailAddress-addEmailAddressHeader">
          <span>Add Email Address</span>
        </Localized>
      }
    >
      <Form onSubmit={props.onSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="oneAndAHalf">
              <Localized id="addEmailAddress-whatItIs">
                <Typography variant="bodyCopy">
                  For your added security, we require users to add an email
                  address to their accounts. Your email address will be used to:
                </Typography>
              </Localized>
              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}
              <EmailField disabled={submitting} />
              <ConfirmEmailField disabled={submitting} />
              <Localized id="addEmailAddress-addEmailAddressButton">
                <Button
                  variant="filled"
                  color="primary"
                  size="large"
                  type="submit"
                  fullWidth
                  disabled={submitting}
                >
                  Add Email Address
                </Button>
              </Localized>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </CompleteAccountBox>
  );
};

export default AddEmailAddress;
