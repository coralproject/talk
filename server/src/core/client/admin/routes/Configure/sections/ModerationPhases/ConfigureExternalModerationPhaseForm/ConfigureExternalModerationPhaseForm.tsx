import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import { useRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "react-relay";

import getExternalModerationPhaseLink from "coral-admin/helpers/getExternalModerationPhaseLink";
import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  colorFromMeta,
  parseInteger,
  ValidationMessage,
} from "coral-framework/lib/form";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import {
  composeValidators,
  required,
  validateURL,
  validateWholeNumberBetween,
} from "coral-framework/lib/validation";
import { GQLCOMMENT_BODY_FORMAT } from "coral-framework/schema";
import {
  Button,
  CallOut,
  Flex,
  FormField,
  HelperText,
  HorizontalGutter,
  Label,
  Option,
  SelectField,
  TextField,
} from "coral-ui/components/v2";

import {
  COMMENT_BODY_FORMAT,
  ConfigureExternalModerationPhaseForm_phase,
} from "coral-admin/__generated__/ConfigureExternalModerationPhaseForm_phase.graphql";

import CreateExternalModerationPhaseMutation from "./CreateExternalModerationPhaseMutation";
import UpdateExternalModerationPhaseMutation from "./UpdateExternalModerationPhaseMutation";

interface Props {
  onCancel?: () => void;
  phase: ConfigureExternalModerationPhaseForm_phase | null;
}

const initialValues = (phase?: any) =>
  phase
    ? phase
    : {
        name: "",
        url: "",
        timeout: 200,
        format: "HTML",
      };

const ConfigureExternalModerationPhaseForm: FunctionComponent<Props> = ({
  onCancel,
  phase,
}) => {
  const create = useMutation(CreateExternalModerationPhaseMutation);
  const update = useMutation(UpdateExternalModerationPhaseMutation);
  const { router } = useRouter();
  const onSubmit = useCallback(
    async (values: {
      name: string;
      url: string;
      format: COMMENT_BODY_FORMAT;
      timeout: number;
      id: string;
    }) => {
      try {
        if (phase) {
          // The external moderation phase was defined, update it.
          await update(values);
        } else {
          // The external moderation phase wasn't defined, create it.
          const result = await create(values);

          // Redirect the user to the new external moderation phase page.
          router.push(getExternalModerationPhaseLink(result.phase.id));

          // We don't need to close this modal because we are navigating...
        }

        return;
      } catch (err) {
        if (err instanceof InvalidRequestError) {
          return err.invalidArgs;
        }
        return { [FORM_ERROR]: err.message };
      }
    },
    [phase, create, update, router]
  );

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues(phase)}>
      {({ handleSubmit, submitting, submitError, pristine }) => (
        <form autoComplete="off" onSubmit={handleSubmit}>
          <HorizontalGutter size="double">
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}
            <Field name="name" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormField>
                  <Localized id="configure-moderationPhases-name">
                    <Label>Name</Label>
                  </Localized>
                  <TextField {...input} color={colorFromMeta(meta)} fullWidth />
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <Field
              name="url"
              validate={composeValidators(required, validateURL)}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="configure-moderationPhases-endpointURL">
                    <Label>Callback URL</Label>
                  </Localized>
                  <Localized id="configure-moderationPhases-endpointURL-details">
                    <HelperText>
                      The URL that Coral moderation requests will be POST'ed to.
                      The provided URL must respond within the designated
                      timeout or the decision of the moderation action will be
                      skipped.
                    </HelperText>
                  </Localized>
                  <TextField
                    {...input}
                    placeholder="https://"
                    color={colorFromMeta(meta)}
                    fullWidth
                  />
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <Field
              name="timeout"
              parse={parseInteger}
              validate={composeValidators(
                required,
                validateWholeNumberBetween(100, 10000)
              )}
            >
              {({ input, meta }) => (
                <FormField>
                  <Localized id="configure-moderationPhases-timeout">
                    <Label>Timeout</Label>
                  </Localized>
                  <Localized id="configure-moderationPhases-timeout-details">
                    <HelperText>
                      The time that Coral will wait for your moderation response
                      in milliseconds.
                    </HelperText>
                  </Localized>
                  <TextField
                    {...input}
                    type="number"
                    color={colorFromMeta(meta)}
                    fullWidth
                  />
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <Field name="format" validate={composeValidators(required)}>
              {({ input, meta }) => (
                <FormField>
                  <Localized id="configure-moderationPhases-format">
                    <Label>Comment Body Format</Label>
                  </Localized>
                  <Localized id="configure-moderationPhases-format-details">
                    <HelperText>
                      The format that Coral will send the comment body in. By
                      default, Coral will send the comment in the original HTML
                      encoded format. If "Plain Text" is selected, then the HTML
                      stripped version will be sent instead.
                    </HelperText>
                  </Localized>
                  <SelectField {...input} fullWidth>
                    <Localized id="configure-moderationPhases-format-html">
                      <Option value={GQLCOMMENT_BODY_FORMAT.HTML}>HTML</Option>
                    </Localized>
                    <Localized id="configure-moderationPhases-format-plain">
                      <Option value={GQLCOMMENT_BODY_FORMAT.PLAIN_TEXT}>
                        Plain Text
                      </Option>
                    </Localized>
                  </SelectField>
                  <ValidationMessage meta={meta} fullWidth />
                </FormField>
              )}
            </Field>
            <Flex direction="row" justifyContent="flex-end" itemGutter>
              {onCancel && (
                <Localized id="configure-moderationPhases-cancelButton">
                  <Button type="button" color="mono" onClick={onCancel}>
                    Cancel
                  </Button>
                </Localized>
              )}
              {phase ? (
                <Localized id="configure-moderationPhases-updateExternalModerationPhaseButton">
                  <Button type="submit" disabled={submitting || pristine}>
                    Update details
                  </Button>
                </Localized>
              ) : (
                <Localized id="configure-moderationPhases-addExternalModerationPhase">
                  <Button type="submit" disabled={submitting}>
                    Add external moderation phase
                  </Button>
                </Localized>
              )}
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

const enhanced = withFragmentContainer<Props>({
  phase: graphql`
    fragment ConfigureExternalModerationPhaseForm_phase on ExternalModerationPhase {
      id
      name
      url
      timeout
      format
    }
  `,
})(ConfigureExternalModerationPhaseForm);

export default enhanced;
