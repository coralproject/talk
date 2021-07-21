import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FORM_ERROR, FormApi, FormState } from "final-form";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { streamColorFromMeta } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateDeleteConfirmation,
} from "coral-framework/lib/validation";
import CLASSES from "coral-stream/classes";
import {
  Flex,
  FormField,
  HorizontalGutter,
  Icon,
  InputLabel,
  PasswordField,
  TextField,
} from "coral-ui/components/v2";
import { Button, CallOut, ValidationMessage } from "coral-ui/components/v3";

import PageStepBar from "./Common/PageStepBar";
import RequestAccountDeletionMutation from "./RequestAccountDeletionMutation";

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
    FormState<any>,
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
        className={cn(sharedStyles.header, CLASSES.deleteMyAccountModal.header)}
      >
        <div className={sharedStyles.headerContent}>
          <Localized id="profile-account-deleteAccount-pages-sharedHeader">
            <div
              className={cn(
                sharedStyles.subHeaderText,
                CLASSES.deleteMyAccountModal.subHeaderText
              )}
            >
              Delete my account
            </div>
          </Localized>
          <Localized id="profile-account-deleteAccount-pages-confirmSubHeader">
            <div
              className={cn(
                sharedStyles.headerText,
                CLASSES.deleteMyAccountModal.headerText
              )}
            >
              Are you sure?
            </div>
          </Localized>
        </div>
      </Flex>
      <div className={cn(sharedStyles.body, CLASSES.deleteMyAccountModal.body)}>
        <PageStepBar step={step} />

        <Localized id="profile-account-deleteAccount-confirmDescContent">
          <div
            className={cn(
              sharedStyles.sectionContent,
              CLASSES.deleteMyAccountModal.sectionContent
            )}
          >
            To confirm you would like to delete your account please type in the
            following phrase into the text box below:
          </div>
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
                <Localized
                  id="profile-account-deleteAccount-pages-phrase"
                  attrs={{ "aria-label": true }}
                >
                  <TextField
                    fullWidth
                    disabled
                    readOnly
                    value="delete"
                    aria-label=""
                    className={styles.input}
                  />
                </Localized>
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
                        <Localized id="profile-account-deleteAccount-pages-confirmPhraseLabel">
                          <InputLabel htmlFor={input.name}>
                            To confirm, type phrase below:
                          </InputLabel>
                        </Localized>
                        <TextField
                          {...input}
                          fullWidth
                          id={input.name}
                          data-testid="confirm-page-confirmation"
                          disabled={submitting}
                          color={streamColorFromMeta(meta)}
                          autoComplete="off"
                        />
                        <div className={styles.validationMessage}>
                          <ValidationMessage
                            meta={meta}
                            className={CLASSES.validationMessage}
                          />
                        </div>
                      </FormField>
                    )}
                  </Field>
                </FormField>
                <FormField>
                  <Field name="password" validate={composeValidators(required)}>
                    {({ input, meta }) => (
                      <FormField>
                        <Localized id="profile-account-deleteAccount-pages-confirmPasswordLabel">
                          <InputLabel htmlFor={input.name}>
                            Enter your password:
                          </InputLabel>
                        </Localized>
                        <PasswordField
                          {...input}
                          fullWidth
                          id={input.name}
                          data-testid="confirm-page-password"
                          disabled={submitting}
                          color={streamColorFromMeta(meta)}
                          autoComplete="off"
                        />
                        <div className={styles.validationMessage}>
                          <ValidationMessage
                            meta={meta}
                            className={CLASSES.validationMessage}
                          />
                        </div>
                      </FormField>
                    )}
                  </Field>
                </FormField>

                {submitError && (
                  <CallOut
                    color="error"
                    icon={<Icon size="sm">error</Icon>}
                    titleWeight="semiBold"
                    title={submitError}
                    role="alert"
                  />
                )}
              </HorizontalGutter>
              <div className={styles.controls}>
                <HorizontalGutter>
                  <Flex justifyContent="flex-end">
                    <Localized id="profile-account-deleteAccount-pages-cancel">
                      <Button
                        variant="outlined"
                        color="secondary"
                        upperCase
                        className={cn(
                          sharedStyles.cancelButton,
                          CLASSES.deleteMyAccountModal.cancelButton
                        )}
                        onClick={onCancelClicked}
                      >
                        Cancel
                      </Button>
                    </Localized>
                    <Localized id="profile-account-deleteAccount-pages-deleteButton">
                      <Button
                        color="secondary"
                        variant="filled"
                        type="submit"
                        upperCase
                        disabled={preventSubmit(formProps)}
                        className={
                          CLASSES.deleteMyAccountModal.deleteMyAccountButton
                        }
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
