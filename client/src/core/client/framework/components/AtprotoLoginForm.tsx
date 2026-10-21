import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import {
  FormError,
  OnSubmit,
  streamColorFromMeta,
} from "coral-framework/lib/form";
import { composeValidators, required } from "coral-framework/lib/validation";
import { AtprotoHandleInput } from "coral-framework/rest";
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
import AtprotoButton from "./AtprotoButton";
import AtprotoHandleTypeahead from "./AtprotoHandleTypeahead";

interface FormErrorProps extends AtprotoHandleInput, FormError {}

export interface SignInWithAtproto {
  onSubmit: OnSubmit<FormErrorProps>;
  /** typeaheadHost suggests handles as they're typed, when it's set. */
  typeaheadHost?: string | null;
}

const SignInWithAtprotoForm: FunctionComponent<SignInWithAtproto> = (props) => {
  return (
    <Form onSubmit={props.onSubmit}>
      {({ handleSubmit, submitting, submitError, form }) => (
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
                    <Localized id="signIn-atprotoHandleLabel">
                      <InputLabel htmlFor={input.name}>
                        ATproto or Bluesky Handle
                      </InputLabel>
                    </Localized>
                    <AtprotoHandleTypeahead
                      host={props.typeaheadHost}
                      value={input.value}
                      onChange={(handle) => form.change("handle", handle)}
                      onSubmit={() => void form.submit()}
                    >
                      <Localized
                        id="signIn-atprotoHandleTextField"
                        attrs={{ placeholder: true }}
                      >
                        <TextField
                          {...input}
                          id={input.name}
                          placeholder="yourname.bsky.social"
                          type="text"
                          color={streamColorFromMeta(meta)}
                          disabled={submitting}
                          fullWidth
                        />
                      </Localized>
                    </AtprotoHandleTypeahead>
                    <ValidationMessage meta={meta} />
                  </FormField>
                )}
              </Field>
            </div>
            <div className={styles.actions}>
              <Localized id="signIn-signInWithAtproto">
                <AtprotoButton>Sign in with Atproto or Bluesky</AtprotoButton>
              </Localized>
            </div>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default SignInWithAtprotoForm;
