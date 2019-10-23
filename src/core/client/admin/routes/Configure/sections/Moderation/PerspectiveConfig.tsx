import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FieldSet,
  FormField,
  HelperText,
  Label,
  TextField,
  TextFieldAdornment,
} from "coral-admin/ui/components";
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
import { HorizontalGutter } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import PermissionField from "../../PermissionField";
import SectionContent from "../../SectionContent";
import SubHeader from "../../SubHeader";
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
        <Header component="legend">Toxic comment filter</Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-moderation-perspective-explanation"
          strong={<strong />}
        >
          <Description>
            Using the Perspective API, the Toxic Comment filter warns users when
            comments exceed the predefined toxicity threshold. Comments with a
            toxicity score above the threshold will not be published and are
            placed in the Pending Queue for review by a moderator. If approved
            by a moderator, the comment will be published.
          </Description>
        </Localized>

        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-perspective-filter">
            <Label component="legend">Toxic comment filter</Label>
          </Localized>
          <OnOffField
            name="integrations.perspective.enabled"
            disabled={disabled}
          />
        </FormField>

        <FormField>
          <HorizontalGutter spacing={1}>
            <Localized id="configure-moderation-perspective-toxicityThreshold">
              <Label htmlFor="configure-moderation-perspective-threshold">
                Toxicity threshold
              </Label>
            </Localized>
            <Localized
              id="configure-moderation-perspective-toxicityThresholdDescription"
              $default={TOXICITY_THRESHOLD_DEFAULT + "%"}
            >
              <HelperText>
                This value can be set a percentage between 0 and 100. This
                number represents the likelihood that a comment is toxic,
                according to Perspective API. By default the threshold is set to
                $default.
              </HelperText>
            </Localized>
          </HorizontalGutter>
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
                  adornment={<TextFieldAdornment>%</TextFieldAdornment>}
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
          <HorizontalGutter spacing={1}>
            <Localized id="configure-moderation-perspective-toxicityModel">
              <Label htmlFor="configure-moderation-perspective-model">
                Toxicity model
              </Label>
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
              <HelperText>
                Choose your Perspective Model. The default is $default. You can
                find out more about model choices here.
              </HelperText>
            </Localized>
          </HorizontalGutter>
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
          <HorizontalGutter spacing={1}>
            <Localized id="configure-moderation-perspective-allowStoreCommentData">
              <Label component="legend">
                Allow Google to store comment data
              </Label>
            </Localized>
            <Localized id="configure-moderation-perspective-allowStoreCommentDataDescription">
              <HelperText>
                Stored comments will be used for future research and community
                model building purposes to improve the API over time.
              </HelperText>
            </Localized>
          </HorizontalGutter>
          <div>
            <PermissionField
              name="integrations.perspective.doNotStore"
              disabled={disabled}
              invert
            />
          </div>
        </FormField>
        <HorizontalGutter spacing={3}>
          <Localized id="configure-configurationSubHeader" strong={<strong />}>
            <SubHeader>Configuration</SubHeader>
          </Localized>
          <Localized
            id="configure-moderation-perspective-accountNote"
            externalLink={<ExternalLink />}
          >
            <HelperText>
              For additional information on how to set up the Perspective Toxic
              Comment Filter please visit:
              https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md
            </HelperText>
          </Localized>
        </HorizontalGutter>
        <APIKeyField
          name="integrations.perspective.key"
          disabled={disabled}
          validate={validateWhen(isEnabled, required)}
        />
        <FormField>
          <Localized id="configure-moderation-perspective-customEndpoint">
            <Label htmlFor="configure-moderation-perspective-customEndpoint">
              Custom endpoint
            </Label>
          </Localized>
          <Localized
            id="configure-moderation-perspective-defaultEndpoint"
            $default={TOXICITY_ENDPOINT_DEFAULT}
          >
            <HelperText>
              By default the endpoint is set to $default. You may override this
              here
            </HelperText>
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
