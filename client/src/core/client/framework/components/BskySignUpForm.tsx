import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import {
  FormError,
  OnSubmit,
  streamColorFromMeta,
} from "coral-framework/lib/form";
import { composeValidators, required } from "coral-framework/lib/validation";
import { BskyHandleInput } from "coral-framework/rest";
import CLASSES from "coral-stream/classes";
import {
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";
import { CallOut, ValidationMessage } from "coral-ui/components/v3";
import React, { FunctionComponent } from "react";
import { Field, Form } from "react-final-form";
import styles from "../../auth/views/SignIn/SignInWithEmail.css";
import BskyButton from "./BskyButton";

interface FormProps {
  input: BskyHandleInput;
}

interface FormErrorProps extends FormProps, FormError {}

export interface SignUpWithBsky {
  onSubmit: OnSubmit<FormErrorProps>;
}

const SignUpWithBskyForm: FunctionComponent<SignUpWithBsky> = (props) => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter>
            {submitError && (
              <CallOut
                className={CLASSES.login.error}
                color="error"
                title={submitError}
              />
            )}
            <div className={cn(CLASSES.login.field, styles.field)}>
              <Field name="handle" validate={composeValidators(required)}>
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="signUp-bskyHandleLabel">
                      <InputLabel htmlFor={input.name}>
                        ATproto or Bluesky Handle
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="signUp-bskyHandleTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="immber.bsky.social"
                        type="text"
                        color={streamColorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} />
                  </FormField>
                )}
              </Field>
            </div>
            <div className={styles.actions}>
              <Localized id="signUp-signUpWithBsky">
                <BskyButton>Sign Up with Bluesky</BskyButton>
              </Localized>
            </div>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignUpWithBskyForm;
