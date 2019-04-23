import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { ExternalLink } from "talk-framework/lib/i18n/components";
import {
  composeValidators,
  required,
  validateURL,
  Validator,
} from "talk-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
} from "talk-ui/components";

import ConfigurationSubHeader from "../../../components/ConfigurationSubHeader";
import Header from "../../../components/Header";
import OnOffField from "../../../components/OnOffField";
import ValidationMessage from "../../../components/ValidationMessage";
import APIKeyField from "./APIKeyField";

interface Props {
  disabled: boolean;
}

const AkismetConfig: StatelessComponent<Props> = ({ disabled }) => {
  const validateWhenEnabled = (validator: Validator): Validator => (
    v,
    values
  ) => {
    if (values.integrations.akismet.enabled) {
      return validator(v, values);
    }
    return "";
  };
  return (
    <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
      <Localized id="configure-moderation-akismet-title">
        <Header container="legend">Akismet Spam Detection Filter</Header>
      </Localized>
      <Localized
        id="configure-moderation-akismet-explanation"
        strong={<strong />}
      >
        <Typography variant="detail">
          Submitted comments are passed to the Akismet API for spam detection.
          If a comment is determined to be spam, it will prompt the user,
          indicating that the comment might be considered spam. If the user
          continues after this point with the still spam-like comment, the
          comment will be marked as containing spam, will not be published and
          are placed in the Pending Queue for review by a moderator. If approved
          by a moderator, the comment will be published.
        </Typography>
      </Localized>

      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-akismet-filter">
          <InputLabel container="legend">Spam Detection Filter</InputLabel>
        </Localized>
        <OnOffField name="integrations.akismet.enabled" disabled={disabled} />
      </FormField>
      <div>
        <ConfigurationSubHeader />
        <Localized
          id="configure-moderation-akismet-accountNote"
          externalLink={<ExternalLink />}
        >
          <Typography variant="detail">
            Note: You must add your active domain(s) in your Akismet account:
            https://akismet.com/account/
          </Typography>
        </Localized>
      </div>
      <APIKeyField
        name="integrations.akismet.key"
        disabled={disabled}
        validate={validateWhenEnabled(required)}
      />

      <FormField>
        <Localized id="configure-moderation-akismet-siteURL">
          <InputLabel htmlFor="configure-moderation-akismet-site">
            Site URL
          </InputLabel>
        </Localized>
        <Field
          name={"integrations.akismet.site"}
          validate={validateWhenEnabled(
            composeValidators(required, validateURL)
          )}
        >
          {({ input, meta }) => (
            <>
              <TextField
                id="configure-moderation-akismet-site"
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

export default AkismetConfig;
