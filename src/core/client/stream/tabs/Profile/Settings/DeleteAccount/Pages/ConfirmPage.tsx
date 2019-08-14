import { FORM_ERROR, FormApi } from "final-form";
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
  FieldSet,
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
            submitting,
            submitError,
            pristine,
            submitSucceeded,
          }) => (
            <form autoComplete="off" onSubmit={handleSubmit}>
              <HorizontalGutter container={<FieldSet />}>
                <TextField fullWidth disabled readOnly value="delete" />
                <Field
                  name="confirmation"
                  validate={composeValidators(
                    required,
                    validateDeleteConfirmation("delete")
                  )}
                >
                  {({ input, meta }) => (
                    <FormField container={<FieldSet />}>
                      <Localized id="profile-settings-deleteAccount-pages-confirmPhraseLabel">
                        <InputLabel>To confirm, type phrase below:</InputLabel>
                      </Localized>
                      <TextField
                        fullWidth
                        id={input.name}
                        disabled={submitting}
                        color={colorFromMeta(meta)}
                        autoComplete="confirmation"
                        {...input}
                      />
                      <ValidationMessage fullWidth meta={meta} />
                    </FormField>
                  )}
                </Field>
                <Field name="password">
                  {({ input, meta }) => (
                    <FormField container={<FieldSet />}>
                      <Localized id="profile-settings-deleteAccount-pages-confirmPasswordLabel">
                        <InputLabel>Enter your password:</InputLabel>
                      </Localized>
                      <PasswordField
                        fullWidth
                        id={input.name}
                        disabled={submitting}
                        color={colorFromMeta(meta)}
                        autoComplete="password"
                        {...input}
                      />
                      <ValidationMessage fullWidth meta={meta} />
                    </FormField>
                  )}
                </Field>
                {submitError && (
                  <CallOut color="error" fullWidth>
                    {submitError}
                  </CallOut>
                )}
              </HorizontalGutter>
              <div className={styles.controls}>
                <HorizontalGutter container={<FieldSet />}>
                  <Flex justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      className={sharedStyles.cancelButton}
                      onClick={onCancelClicked}
                    >
                      <Localized id="profile-settings-deleteAccount-pages-cancel">
                        Cancel
                      </Localized>
                    </Button>
                    <Localized id="profile-settings-deleteAccount-pages-deleteButton">
                      <Button
                        color="error"
                        variant="filled"
                        type="submit"
                        disabled={submitting || pristine}
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
