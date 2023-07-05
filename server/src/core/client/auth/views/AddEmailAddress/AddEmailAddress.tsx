import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import ConfirmEmailField from "coral-auth/components/ConfirmEmailField";
import EmailField from "coral-auth/components/EmailField";
import Main from "coral-auth/components/Main";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import {
  SetDuplicateEmailMutation,
  SetViewMutation,
} from "coral-auth/mutations";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import SetEmailMutation from "./SetEmailMutation";
import { ListItem, UnorderedList } from "./UnorderedList";

import styles from "./AddEmailAddress.css";

interface FormProps {
  email: string;
}

interface FormErrorProps extends FormProps, FormError {}

const AddEmailAddressContainer: FunctionComponent = () => {
  const setEmail = useMutation(SetEmailMutation);
  const setDuplicateEmail = useMutation(SetDuplicateEmailMutation);
  const setView = useMutation(SetViewMutation);
  const onSubmit: OnSubmit<FormErrorProps> = useCallback(
    async (input, form) => {
      try {
        await setEmail({ email: input.email });
        return;
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          if (error.code === "DUPLICATE_EMAIL") {
            setDuplicateEmail({ duplicateEmail: input.email });
            setView({ view: "LINK_ACCOUNT" });
            return;
          }
          return error.invalidArgs;
        }
        return { [FORM_ERROR]: error.message };
      }
    },
    [setDuplicateEmail, setEmail, setView]
  );
  const ref = useResizePopup();

  return (
    <div ref={ref} data-testid="addEmailAddress-container">
      <div role="banner" className={cn(CLASSES.login.bar, styles.bar)}>
        <Localized id="addEmailAddress-addEmailAddressHeader">
          <div className={cn(CLASSES.login.title, styles.title)}>
            Add Email Address
          </div>
        </Localized>
      </div>
      <Main id="add-email-main" data-testid="addEmailAddress-main">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Localized id="addEmailAddress-whatItIs">
                <div className={styles.description}>
                  For your added security, we require users to add an email
                  address to their accounts. Your email address will be used to:
                </div>
              </Localized>
              <UnorderedList>
                <ListItem icon={<Icon>done</Icon>}>
                  <Localized id="addEmailAddress-receiveUpdates">
                    <div className={styles.description}>
                      Receive updates regarding any changes to your account
                      (email address, username, password, etc.)
                    </div>
                  </Localized>
                </ListItem>
                <ListItem icon={<Icon>done</Icon>}>
                  <Localized id="addEmailAddress-allowDownload">
                    <div className={styles.description}>
                      Allow you to download your comments.
                    </div>
                  </Localized>
                </ListItem>
                <ListItem icon={<Icon>done</Icon>}>
                  <Localized id="addEmailAddress-sendNotifications">
                    <div className={styles.description}>
                      Send comment notifications that you have chosen to
                      receive.
                    </div>
                  </Localized>
                </ListItem>
              </UnorderedList>
              {submitError && (
                <div className={cn(CLASSES.login.errorContainer, styles.error)}>
                  <CallOut
                    className={CLASSES.login.error}
                    color="error"
                    icon={<Icon size="sm">error</Icon>}
                    title={submitError}
                  />
                </div>
              )}
              <div className={cn(CLASSES.login.field, styles.field)}>
                <EmailField disabled={submitting} />
              </div>
              <div className={cn(CLASSES.login.field, styles.field)}>
                <ConfirmEmailField disabled={submitting} />
              </div>
              <div className={styles.actions}>
                <Localized id="addEmailAddress-addEmailAddressButton">
                  <Button
                    variant="filled"
                    color="primary"
                    fontSize="medium"
                    paddingSize="medium"
                    upperCase
                    type="submit"
                    fullWidth
                    disabled={submitting}
                  >
                    Add Email Address
                  </Button>
                </Localized>
              </div>
            </form>
          )}
        </Form>
      </Main>
    </div>
  );
};

export default AddEmailAddressContainer;
