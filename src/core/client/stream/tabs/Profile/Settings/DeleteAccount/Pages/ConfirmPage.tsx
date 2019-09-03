import { FORM_ERROR, FormApi, FormState } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateDeleteConfirmation,
} from "coral-framework/lib/validation";
import {
  Button,
  CallOut,
  Flex,
  FormField,
  HorizontalGutter,
  InputLabel,
  PasswordField,
  TextField,
  Typography,
} from "coral-ui/components";

import RequestAccountDeletionMutation from "./RequestAccountDeletionMutation";

import PageStepBar from "./Common/PageStepBar";

import sharedStyles from "./Common/Page.css";
import styles from "./ConfirmPage.css";

interface Props {
  step: number;
  onCancel: () => void;
  onProceed: () => void;
}

interface FormProps {
  confirmation: string;
  password: string;
}

const preventSubmit = (
  state: Pick<
    FormState,
    | "pristine"
    | "hasSubmitErrors"
    | "hasValidationErrors"
    | "dirtySinceLastSubmit"
  >
) =>
  state.pristine ||
  state.hasValidationErrors ||
  (state.hasSubmitErrors && !state.dirtySinceLastSubmit);

const ConfirmPage: FunctionComponent<Props> = ({
  step,
  onCancel,
  onProceed,
}) => {
  const requestAccountDeletion = useMutation(RequestAccountDeletionMutation);

  const onSubmit = useCallback(
    async (input: FormProps, form: FormApi) => {
      try {
        await requestAccountDeletion({
          password: input.password,
        });
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }

        return {
          [FORM_ERROR]: err.message,
        };
      }

      form.reset();

      onProceed();
      return;
    },
    [onProceed]
  );

  const onCancelClicked = useCallback(() => {
    onCancel();
  }, [onProceed]);

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        className={sharedStyles.header}
      >
        <Localized id="profile-settings-deleteAccount-pages-confirmHeader">
          <Typography variant="header2" className={sharedStyles.headerText}>
            Confirm account deletion?
          </Typography>
        </Localized>
      </Flex>
      <div className={sharedStyles.body}>
        <PageStepBar step={step} />

        <Localized id="profile-settings-deleteAccount-pages-confirmDescHeader">
          <Typography
            variant="bodyCopyBold"
            className={sharedStyles.sectionHeader}
          >
            Are you sure you want to delete your account?
          </Typography>
        </Localized>
        <Localized id="profile-settings-deleteAccount-confirmDescContent">
          <Typography
            variant="bodyCopy"
            className={sharedStyles.sectionContent}
          >
            To confirm you would like to delete your account please type in the
            following phrase into the text box below:
          </Typography>
        </Localized>

        <Form onSubmit={onSubmit}>
          {({
            handleSubmit,
            submitError,
            invalid,
            submitting,
            ...formProps
          }) => (
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              data-testid="confirm-page-form"
            >
              <HorizontalGutter>
                <TextField fullWidth disabled readOnly value="delete" />
                <FormField>
                  <Field
                    name="confirmation"
                    validate={composeValidators(
                      required,
                      validateDeleteConfirmation("delete")
                    )}
                  >
                    {({ input, meta }) => (
                      <FormField>
                        <Localized id="profile-settings-deleteAccount-pages-confirmPhraseLabel">
                          <InputLabel>
                            To confirm, type phrase below:
                          </InputLabel>
                        </Localized>
                        <TextField
                          fullWidth
                          id={input.name}
                          data-testid="confirm-page-confirmation"
                          disabled={submitting}
                          color={colorFromMeta(meta)}
                          autoComplete="confirmation"
                          {...input}
                        />
                        <ValidationMessage fullWidth meta={meta} />
                      </FormField>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Field name="password" validate={composeValidators(required)}>
                    {({ input, meta }) => (
                      <FormField>
                        <Localized id="profile-settings-deleteAccount-pages-confirmPasswordLabel">
                          <InputLabel>Enter your password:</InputLabel>
                        </Localized>
                        <PasswordField
                          fullWidth
                          id={input.name}
                          data-testid="confirm-page-password"
                          disabled={submitting}
                          color={colorFromMeta(meta)}
                          autoComplete="password"
                          {...input}
                        />
                        <ValidationMessage fullWidth meta={meta} />
                      </FormField>
                    )}
                  </Field>
                </FormField>

                {submitError && (
                  <CallOut color="error" fullWidth>
                    {submitError}
                  </CallOut>
                )}
              </HorizontalGutter>
              <div className={styles.controls}>
                <HorizontalGutter>
                  <Flex justifyContent="flex-end">
                    <Localized id="profile-settings-deleteAccount-pages-cancel">
                      <Button
                        variant="outlined"
                        className={sharedStyles.cancelButton}
                        onClick={onCancelClicked}
                      >
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="profile-settings-deleteAccount-pages-deleteButton">
                      <Button
                        color="error"
                        variant="filled"
                        type="submit"
                        disabled={preventSubmit(formProps)}
                        className={sharedStyles.deleteButton}
                      >
                        Delete my account
                      </Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
              </div>
            </form>
          )}
        </Form>
      </div>
    </>
  );
};

export default ConfirmPage;
