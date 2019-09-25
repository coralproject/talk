import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  TOXICITY_ENDPOINT_DEFAULT,
  TOXICITY_MODEL_DEFAULT,
  TOXICITY_THRESHOLD_DEFAULT,
} from "coral-common/constants";
import {
  formatPercentage,
  parseEmptyAsNull,
  parsePercentage,
} from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Condition,
  required,
  validatePercentage,
  validateURL,
  validateWhen,
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
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";
import APIKeyField from "./APIKeyField";

import styles from "./PerspectiveConfig.css";

interface Props {
  disabled: boolean;
}

const isEnabled: Condition = (value, values) =>
  Boolean(values.integrations.perspective.enabled);

const PerspectiveConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <HorizontalGutter
      size="oneAndAHalf"
      container={<FieldSet />}
      data-testid="perspective-container"
    >
      <Localized id="configure-moderation-perspective-title">
        <Header container="legend">Toxic comment filter</Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-moderation-perspective-explanation"
          strong={<strong />}
        >
          <Typography variant="bodyShort">
            Using the Perspective API, the Toxic Comment filter warns users when
            comments exceed the predefined toxicity threshold. Comments with a
            toxicity score above the threshold will not be published and are
            placed in the Pending Queue for review by a moderator. If approved
            by a moderator, the comment will be published.
          </Typography>
        </Localized>

        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-perspective-filter">
            <InputLabel container="legend">Toxic comment filter</InputLabel>
          </Localized>
          <OnOffField
            name="integrations.perspective.enabled"
            disabled={disabled}
          />
        </FormField>

        <FormField>
          <Localized id="configure-moderation-perspective-toxicityThreshold">
            <InputLabel htmlFor="configure-moderation-perspective-threshold">
              Toxicity threshold
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
                  classes={{
                    input: styles.thresholdTextField,
                  }}
                  disabled={disabled}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  adornment={<Typography variant="bodyShort">%</Typography>}
                  placeholder={TOXICITY_THRESHOLD_DEFAULT.toString()}
                  textAlignCenter
                  {...input}
                />
                <ValidationMessage meta={meta} />
              </>
            )}
          </Field>
        </FormField>

        <FormField>
          <Localized id="configure-moderation-perspective-toxicityModel">
            <InputLabel htmlFor="configure-moderation-perspective-model">
              Toxicity model
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
              Choose your Perspective Model. The default is $default. You can
              find out more about model choices here.
            </InputDescription>
          </Localized>
          <Field name="integrations.perspective.model" parse={parseEmptyAsNull}>
            {({ input, meta }) => (
              <>
                <TextField
                  id="configure-moderation-perspective-model"
                  disabled={disabled}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder={TOXICITY_MODEL_DEFAULT}
                  spellCheck={false}
                  fullWidth
                  {...input}
                />
                <ValidationMessage meta={meta} />
              </>
            )}
          </Field>
        </FormField>

        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-perspective-allowStoreCommentData">
            <InputLabel container="legend">
              Allow Google to store comment data
            </InputLabel>
          </Localized>
          <Localized id="configure-moderation-perspective-allowStoreCommentDataDescription">
            <InputDescription>
              Stored comments will be used for future research and community
              model building purposes to improve the API over time.
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
            <Typography variant="fieldDescription">
              For additional information on how to set up the Perspective Toxic
              Comment Filter please visit:
              https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md
            </Typography>
          </Localized>
        </div>
        <APIKeyField
          name="integrations.perspective.key"
          disabled={disabled}
          validate={validateWhen(isEnabled, required)}
        />
        <FormField>
          <Localized id="configure-moderation-perspective-customEndpoint">
            <InputLabel htmlFor="configure-moderation-perspective-customEndpoint">
              Custom endpoint
            </InputLabel>
          </Localized>
          <Localized
            id="configure-moderation-perspective-defaultEndpoint"
            $default={TOXICITY_ENDPOINT_DEFAULT}
          >
            <InputDescription>
              By default the endpoint is set to $default. You may override this
              here
            </InputDescription>
          </Localized>
          <Field
            name="integrations.perspective.endpoint"
            parse={parseEmptyAsNull}
            validate={validateURL}
          >
            {({ input, meta }) => (
              <>
                <TextField
                  id="configure-moderation-perspective-customEndpoint"
                  disabled={disabled}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  placeholder={TOXICITY_ENDPOINT_DEFAULT}
                  spellCheck={false}
                  fullWidth
                  {...input}
                />
                <ValidationMessage meta={meta} />
              </>
            )}
          </Field>
        </FormField>
      </SectionContent>
    </HorizontalGutter>
  );
};

export default PerspectiveConfig;
