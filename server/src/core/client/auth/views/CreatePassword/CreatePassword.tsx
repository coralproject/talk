import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Form } from "react-final-form";

import Main from "coral-auth/components/Main";
import SetPasswordField from "coral-auth/components/SetPasswordField";
import useResizePopup from "coral-auth/hooks/useResizePopup";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import SetPasswordMutation from "./SetPasswordMutation";

import styles from "./CreatePassword.css";

interface FormProps {
  password: string;
}

interface FormErrorProps extends FormProps, FormError {}

const CreatePasswordContainer: FunctionComponent = () => {
  const setPassword = useMutation(SetPasswordMutation);
  const onSubmit: OnSubmit<FormErrorProps> = useCallback(
    async (input, form) => {
      try {
        await setPassword({ password: input.password });
        return;
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
    },
    [setPassword]
  );
  const ref = useResizePopup();

  return (
    <div ref={ref} data-testid="createPassword-container">
      <div role="banner" className={cn(CLASSES.login.bar, styles.bar)}>
        <Localized id="createPassword-createAPassword">
          <div className={cn(CLASSES.login.title, styles.title)}>
            Create a password
          </div>
        </Localized>
      </div>
      <Main id="create-password-main" data-testid="createPassword-main">
        <Form onSubmit={onSubmit}>
          {({ handleSubmit, submitting, submitError }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <Localized id="createPassword-whatItIs">
                <div className={styles.description}>
                  To protect against unauthorized changes to your account, we
                  require users to create a password.
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
                <SetPasswordField disabled={submitting} />
              </div>
              <div className={styles.actions}>
                <Localized id="createPassword-createPasswordButton">
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
                    Create Password
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

export default CreatePasswordContainer;
