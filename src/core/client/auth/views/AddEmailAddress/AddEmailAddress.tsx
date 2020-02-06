import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import { Bar, Title } from "coral-auth/components//Header";
import ConfirmEmailField from "coral-auth/components/ConfirmEmailField";
import EmailField from "coral-auth/components/EmailField";
import Main from "coral-auth/components/Main";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { SetDuplicateEmailMutation } from "coral-auth/mutations";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

import SetEmailMutation from "./SetEmailMutation";
import { ListItem, UnorderedList } from "./UnorderedList";

interface FormProps {
  email: string;
}

interface FormErrorProps extends FormProps, FormError {}

const AddEmailAddressContainer: FunctionComponent = () => {
  const setEmail = useMutation(SetEmailMutation);
  const setDuplicateEmail = useMutation(SetDuplicateEmailMutation);
  const onSubmit: OnSubmit<FormErrorProps> = useCallback(
    async (input, form) => {
      try {
        await setEmail({ email: input.email });
        return;
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          if (error.code === "DUPLICATE_EMAIL") {
            setDuplicateEmail({ duplicateEmail: input.email });
            return;
          }
          return error.invalidArgs;
        }
        return { [FORM_ERROR]: error.message };
      }
    },
    [setEmail]
  );
  const ref = useResizePopup();

  return (
    <div ref={ref} data-testid="addEmailAddress-container">
      <Bar>
        <Localized id="addEmailAddress-addEmailAddressHeader">
          <Title>Add Email Address</Title>
        </Localized>
      </Bar>
      <Main data-testid="addEmailAddress-main">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <HorizontalGutter size="oneAndAHalf">
                <Localized id="addEmailAddress-whatItIs">
                  <Typography variant="bodyCopy">
                    For your added security, we require users to add an email
                    address to their accounts. Your email address will be used
                    to:
                  </Typography>
                </Localized>
                <UnorderedList>
                  <ListItem icon={<Icon>done</Icon>}>
                    <Localized id="addEmailAddress-receiveUpdates">
                      <Typography container="div">
                        Receive updates regarding any changes to your account
                        (email address, username, password, etc.)
                      </Typography>
                    </Localized>
                  </ListItem>
                  <ListItem icon={<Icon>done</Icon>}>
                    <Localized id="addEmailAddress-allowDownload">
                      <Typography container="div">
                        Allow you to download your comments.
                      </Typography>
                    </Localized>
                  </ListItem>
                  <ListItem icon={<Icon>done</Icon>}>
                    <Localized id="addEmailAddress-sendNotifications">
                      <Typography container="div">
                        Send comment notifications that you have chosen to
                        receive.
                      </Typography>
                    </Localized>
                  </ListItem>
                </UnorderedList>
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
      </Main>
    </div>
  );
};

export default AddEmailAddressContainer;
