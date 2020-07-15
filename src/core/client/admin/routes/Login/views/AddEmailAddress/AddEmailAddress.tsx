import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import { Button, CallOut, HorizontalGutter } from "coral-ui/components/v2";

import CompleteAccountBox from "../../CompleteAccountBox";
import SetAuthViewMutation from "../../SetAuthViewMutation";
import SetDuplicateEmailMutation from "../../SetDuplicateEmailMutation";
import ConfirmEmailField from "./ConfirmEmailField";
import EmailField from "./EmailField";
import SetEmailMutation from "./SetEmailMutation";

const AddEmailAddress: FunctionComponent = () => {
  const setDuplicateEmail = useMutation(SetDuplicateEmailMutation);
  const setEmail = useMutation(SetEmailMutation);
  const setView = useMutation(SetAuthViewMutation);
  const onSubmit = useCallback(
    async (input: any) => {
      try {
        await setEmail({ email: input.email });
        return;
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          if (error.code === "DUPLICATE_EMAIL") {
            void setDuplicateEmail({ duplicateEmail: input.email });
            setView({ view: "LINK_ACCOUNT" });
            return;
          }
          return error.invalidArgs;
        }
        return { [FORM_ERROR]: error.message };
      }
    },
    [setEmail]
  );
  return (
    <CompleteAccountBox
      data-testid="addEmailAddress-container"
      title={
        <Localized id="addEmailAddress-addEmailAddressHeader">
          <span>Add Email Address</span>
        </Localized>
      }
    >
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="oneAndAHalf">
              <Localized id="addEmailAddress-whatItIs">
                <div>
                  For your added security, we require users to add an email
                  address to their accounts. Your email address will be used to:
                </div>
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
                  variant="regular"
                  color="regular"
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
