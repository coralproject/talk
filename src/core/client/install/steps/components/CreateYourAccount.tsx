import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field, Form } from "react-final-form";
import { OnSubmit } from "talk-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
  validateEqualPasswords,
  validatePassword,
} from "talk-framework/lib/validation";
import {
  Button,
  ButtonIcon,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";
import { FormData } from "../../containers/AppContainer";
import * as styles from "./styles.css";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CreateYourAccountForm {
  onSubmit: OnSubmit<FormProps>;
  handleGoToPreviousStep: () => void;
  data: FormData;
}

const CreateYourAccount: StatelessComponent<CreateYourAccountForm> = props => {
  return (
    <Form
      onSubmit={props.onSubmit}
      initialValues={{
        email: props.data.email,
        username: props.data.username,
      }}
    >
      {({ handleSubmit, submitting, submitError }) => (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <HorizontalGutter size="double">
            <Typography variant="heading1" align="center">
              <Localized id="install-createYourAccount-title">
                Create an Administrator Account
              </Localized>
            </Typography>

            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}

            <Field
              name="email"
              validate={composeValidators(required, validateEmail)}
            >
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>
                    <Localized id="install-createYourAccount-email">
                      Email
                    </Localized>
                  </InputLabel>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Email"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>

            <Field name="username" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>
                    <Localized id="install-createYourAccount-username">
                      Username
                    </Localized>
                  </InputLabel>
                  <InputDescription>
                    <Localized id="install-createYourAccount-usernameDescription">
                      A unique identifier displayed on your comments. You may
                      use “_” and “.”
                    </Localized>
                  </InputDescription>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Username"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>

            <Field
              name="password"
              validate={composeValidators(required, validatePassword)}
            >
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>
                    <Localized id="install-createYourAccount-password">
                      Password
                    </Localized>
                  </InputLabel>
                  <InputDescription>
                    <Localized id="install-createYourAccount-passwordDescription">
                      Must be at least 8 characters
                    </Localized>
                  </InputDescription>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Password"
                    type="password"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>
            <Field
              name="confirmPassword"
              validate={composeValidators(required, validateEqualPasswords)}
            >
              {({ input, meta }) => (
                <FormField>
                  <InputLabel>
                    <Localized id="install-createYourAccount-confirmPassword">
                      Confirm Password
                    </Localized>
                  </InputLabel>
                  <TextField
                    name={input.name}
                    onChange={input.onChange}
                    value={input.value}
                    placeholder="Confirm Password"
                    type="password"
                    color={
                      meta.touched && (meta.error || meta.submitError)
                        ? "error"
                        : "regular"
                    }
                    disabled={submitting}
                    fullWidth
                  />
                  {meta.touched &&
                    (meta.error || meta.submitError) && (
                      <ValidationMessage fullWidth>
                        {meta.error || meta.submitError}
                      </ValidationMessage>
                    )}
                </FormField>
              )}
            </Field>

            <Flex direction="row" itemGutter>
              <Button
                onClick={props.handleGoToPreviousStep}
                variant="filled"
                color="regular"
                size="large"
                type="submit"
                disabled={submitting}
                fullWidth
              >
                <Localized id="install-back">Back</Localized>
              </Button>

              <Button
                variant="filled"
                color="primary"
                size="large"
                type="submit"
                disabled={submitting}
                fullWidth
              >
                <Localized id="install-next">Next</Localized>
                <ButtonIcon className={styles.buttonIcon}>
                  arrow_forward
                </ButtonIcon>
              </Button>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default CreateYourAccount;
