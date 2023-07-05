import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import Main from "coral-auth/components/Main";
import UsernameField from "coral-auth/components/UsernameField";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import SetUsernameMutation from "./SetUsernameMutation";

import styles from "./CreateUsername.css";

interface FormProps {
  username: string;
}

interface FormErrorProps extends FormProps, FormError {}

const CreateUsernameContainer: FunctionComponent = () => {
  const setUsername = useMutation(SetUsernameMutation);
  const onSubmit: OnSubmit<FormErrorProps> = useCallback(
    async (input, form) => {
      try {
        await setUsername({ username: input.username });
        return;
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [setUsername]
  );
  const ref = useResizePopup();

  return (
    <div ref={ref} data-testid="createUsername-container">
      <div role="banner" className={cn(CLASSES.login.bar, styles.bar)}>
        <Localized id="createUsername-createAUsername">
          <div className={cn(CLASSES.login.title, styles.title)}>
            Create a username
          </div>
        </Localized>
      </div>
      <Main id="create-username-main" data-testid="createUsername-main">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Localized id="createUsername-whatItIs">
                <div className={styles.description}>
                  Your username is an identifier that will appear on all of your
                  comments.
                </div>
              </Localized>
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
                <UsernameField disabled={submitting} />
              </div>
              <div className={styles.actions}>
                <Localized id="createUsername-createUsernameButton">
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
                    Create Username
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

export default CreateUsernameContainer;
