import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Field } from "react-final-form";

import { formatPercentage, parsePercentage } from "talk-framework/lib/form";

import { ExternalLink } from "talk-framework/lib/i18n/components";
import {
  composeValidators,
  required,
  validatePercentage,
  validateURL,
  Validator,
} from "talk-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  TextField,
  Typography,
} from "talk-ui/components";

import ConfigurationSubHeader from "../../../components/ConfigurationSubHeader";
import Header from "../../../components/Header";
import OnOffField from "../../../components/OnOffField";
import PermissionField from "../../../components/PermissionField";
import ValidationMessage from "../../../components/ValidationMessage";
import APIKeyField from "./APIKeyField";

import styles from "./PerspectiveConfig.css";

/* TODO: use a common constants for both client and server. */
const TOXICITY_DEFAULT = 80;

interface Props {
  disabled: boolean;
}

const PerspectiveConfig: StatelessComponent<Props> = ({ disabled }) => {
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
          <InputLabel container="legend">Spam Detection Filter</InputLabel>
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
          $default={TOXICITY_DEFAULT}
        >
          <InputDescription>
            This value can be set a percentage between 0 and 100. This number
            represents the likelihood that a comment is toxic, according to
            Perspective API. Defaults to $default.
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
                placeholder={TOXICITY_DEFAULT.toString()}
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

      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-perspective-allowStoreCommentData">
          <InputLabel container="legend">
            Allow Google to Store Comment Data
          </InputLabel>
        </Localized>
        <Localized id="configure-moderation-perspective-allowStoreCommentDataDescription">
          <InputDescription>
            Stored comments will be used for future research and community model
            building purposes to improve the API over time
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
