import { Localized } from "@fluent/react/compat";
import React, { Component } from "react";
import { Field, Form } from "react-final-form";

import {
  colorFromMeta,
  OnSubmit,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
  validateEqualPasswords,
  validatePassword,
  validateUsername,
} from "coral-framework/lib/validation";
import {
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components/v2";

import BackButton from "./BackButton";
import NextButton from "./NextButton";

interface FormProps {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  onGoToNextStep: () => void;
  onGoToPreviousStep: () => void;
  data: FormProps;
  onSaveData: (newData: FormProps) => void;
}

class CreateYourAccountStep extends Component<Props> {
  private onSubmit: OnSubmit<FormProps> = async (input, form) => {
    this.props.onSaveData(input);
    return this.props.onGoToNextStep();
  };
  public render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        initialValues={{
          email: this.props.data.email,
          username: this.props.data.username,
        }}
      >
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="double">
              <Localized id="install-createYourAccount-title">
                <Typography variant="heading1" align="center">
                  Create an admin account
                </Typography>
              </Localized>

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
                    <Localized id="install-createYourAccount-email">
                      <InputLabel htmlFor={input.name}>Email</InputLabel>
                    </Localized>
                    <Localized
                      id="install-createYourAccount-emailTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Email"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        type="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Field
                name="username"
                validate={composeValidators(required, validateUsername)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-createYourAccount-username">
                      <InputLabel htmlFor={input.name}>Username</InputLabel>
                    </Localized>
                    <Localized id="install-createYourAccount-usernameDescription">
                      <InputDescription>
                        An identifier displayed on your comments. You may use
                        “_” and “.” Spaces not permitted.
                      </InputDescription>
                    </Localized>
                    <Localized
                      id="install-createYourAccount-usernameTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Username"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        autoCapitalize="off"
                        autoCorrect="off"
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Field
                name="password"
                validate={composeValidators(required, validatePassword)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-createYourAccount-password">
                      <InputLabel htmlFor={input.name}>Password</InputLabel>
                    </Localized>
                    <Localized id="install-createYourAccount-passwordDescription">
                      <InputDescription>
                        Must be at least 8 characters
                      </InputDescription>
                    </Localized>
                    <Localized
                      id="install-createYourAccount-passwordTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Password"
                        type="password"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>
              {/* FIXME: (wyattjoh) evaluate removing this in favor of the reveal */}
              <Field
                name="confirmPassword"
                validate={composeValidators(required, validateEqualPasswords)}
              >
                {({ input, meta }) => (
                  <FormField>
                    <Localized id="install-createYourAccount-confirmPassword">
                      <InputLabel htmlFor={input.name}>
                        Confirm password
                      </InputLabel>
                    </Localized>
                    <Localized
                      id="install-createYourAccount-confirmPasswordTextField"
                      attrs={{ placeholder: true }}
                    >
                      <TextField
                        {...input}
                        id={input.name}
                        placeholder="Confirm Password"
                        type="password"
                        color={colorFromMeta(meta)}
                        disabled={submitting}
                        fullWidth
                      />
                    </Localized>
                    <ValidationMessage meta={meta} fullWidth />
                  </FormField>
                )}
              </Field>

              <Flex direction="row-reverse" itemGutter>
                <NextButton submitting={submitting} />
                <BackButton
                  submitting={submitting}
                  onGoToPreviousStep={this.props.onGoToPreviousStep}
                />
              </Flex>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    );
  }
}

export default CreateYourAccountStep;
