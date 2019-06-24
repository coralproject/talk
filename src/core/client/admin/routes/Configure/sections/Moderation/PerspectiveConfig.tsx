import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Field } from "react-final-form";

import { formatPercentage, parsePercentage } from "coral-framework/lib/form";

import {
  TOXICITY_MODEL_DEFAULT,
  TOXICITY_THRESHOLD_DEFAULT,
} from "coral-common/constants";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  composeValidators,
  required,
  validatePercentage,
  validateURL,
  Validator,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";

import ConfigurationSubHeader from "../../ConfigurationSubHeader";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import PermissionField from "../../PermissionField";
import ValidationMessage from "../../ValidationMessage";
import APIKeyField from "./APIKeyField";

import styles from "./PerspectiveConfig.css";

interface Props {
  disabled: boolean;
}

const PerspectiveConfig: FunctionComponent<Props> = ({ disabled }) => {
  const validateWhenEnabled = (validator: Validator): Validator => (
    v,
    values
  ) => {
    if (values.integrations.perspective.enabled) {
      return validator(v, values);
    }
    return "";
  };
  return (
    <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
      <Localized id="configure-moderation-perspective-title">
        <Header container="legend">Perspective Toxic Comment Filter</Header>
      </Localized>
      <Localized
        id="configure-moderation-perspective-explanation"
        strong={<strong />}
      >
        <Typography variant="detail">
          Using the Perspective API, the Toxic Comment filter warns users when
          comments exceed the predefined toxicity threshold. Comments with a
          toxicity score above the threshold will not be published and are
          placed in the Pending Queue for review by a moderator. If approved by
          a moderator, the comment will be published.
        </Typography>
      </Localized>

      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-perspective-filter">
          <InputLabel container="legend">Toxic Comment Filter</InputLabel>
        </Localized>
        <OnOffField
          name="integrations.perspective.enabled"
          disabled={disabled}
        />
      </FormField>

      <FormField>
        <Localized id="configure-moderation-perspective-toxicityThreshold">
          <InputLabel htmlFor="configure-moderation-perspective-threshold">
            Toxicity Threshold
          </InputLabel>
        </Localized>
        <Localized
          id="configure-moderation-perspective-toxicityThresholdDescription"
          $default={TOXICITY_THRESHOLD_DEFAULT + "%"}
        >
          <InputDescription>
            This value can be set a percentage between 0 and 100. This number
            represents the likelihood that a comment is toxic, according to
            Perspective API. By default the threshold is set to $default.
          </InputDescription>
        </Localized>
        <Field
          name="integrations.perspective.threshold"
          parse={parsePercentage}
          format={formatPercentage}
          validate={validatePercentage(0, 1)}
        >
          {({ input, meta }) => (
            <>
              <TextField
                id="configure-moderation-perspective-threshold"
                className={styles.thresholdTextField}
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                adornment={<Typography variant="bodyCopy">%</Typography>}
                placeholder={TOXICITY_THRESHOLD_DEFAULT.toString()}
                textAlignCenter
              />
              {meta.touched && (meta.error || meta.submitError) && (
                <ValidationMessage>
                  {meta.error || meta.submitError}
                </ValidationMessage>
              )}
            </>
          )}
        </Field>
      </FormField>

      <FormField>
        <Localized id="configure-moderation-perspective-toxicityModel">
          <InputLabel htmlFor="configure-moderation-perspective-model">
            Toxicity Model
          </InputLabel>
        </Localized>
        <Localized
          id="configure-moderation-perspective-toxicityModelDescription"
          externalLink={
            <ExternalLink
              href={
                "https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#models"
              }
            />
          }
          $default={TOXICITY_MODEL_DEFAULT}
        >
          <InputDescription>
            Choose your Perspective Model. The default is $default. You can find
            out more about model choices here.
          </InputDescription>
        </Localized>
        <Field name="integrations.perspective.model">
          {({ input, meta }) => (
            <>
              <TextField
                id="configure-moderation-perspective-model"
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                placeholder={TOXICITY_MODEL_DEFAULT}
                spellCheck={false}
              />
              {meta.touched && (meta.error || meta.submitError) && (
                <ValidationMessage>
                  {meta.error || meta.submitError}
                </ValidationMessage>
              )}
            </>
          )}
        </Field>
      </FormField>

      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-perspective-allowStoreCommentData">
          <InputLabel container="legend">
            Allow Google to Store Comment Data
          </InputLabel>
        </Localized>
        <Localized id="configure-moderation-perspective-allowStoreCommentDataDescription">
          <InputDescription>
            Stored comments will be used for future research and community model
            building purposes to improve the API over time.
          </InputDescription>
        </Localized>
        <div>
          <PermissionField
            name="integrations.perspective.doNotStore"
            disabled={disabled}
            invert
          />
        </div>
      </FormField>
      <div>
        <ConfigurationSubHeader />
        <Localized
          id="configure-moderation-perspective-accountNote"
          externalLink={<ExternalLink />}
        >
          <Typography variant="detail">
            For additional information on how to set up the Perspective Toxic
            Comment Filter please visit:
            https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md
          </Typography>
        </Localized>
      </div>
      <APIKeyField
        name="integrations.perspective.key"
        disabled={disabled}
        validate={validateWhenEnabled(required)}
      />
      <FormField>
        <Localized id="configure-moderation-perspective-customEndpoint">
          <InputLabel htmlFor="configure-moderation-perspective-customEndpoint">
            Custom Endpoint
          </InputLabel>
        </Localized>
        <Localized
          id="configure-moderation-perspective-defaultEndpoint"
          $default="https://commentanalyzer.googleapis.com/v1alpha1"
        >
          <InputDescription>
            By default the endpoint is set to $default. You may override this
            here
          </InputDescription>
        </Localized>
        <Field
          name="integrations.perspective.endpoint"
          validate={composeValidators(validateURL)}
        >
          {({ input, meta }) => (
            <>
              <TextField
                id="configure-moderation-perspective-customEndpoint"
                name={input.name}
                onChange={input.onChange}
                value={input.value}
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {meta.touched && (meta.error || meta.submitError) && (
                <ValidationMessage>
                  {meta.error || meta.submitError}
                </ValidationMessage>
              )}
            </>
          )}
        </Field>
      </FormField>
    </HorizontalGutter>
  );
};

export default PerspectiveConfig;
