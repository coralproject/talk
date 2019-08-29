import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";

import ConfigurationSubHeader from "../../ConfigurationSubHeader";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import ValidationMessage from "../../ValidationMessage";
import APIKeyField from "./APIKeyField";

interface Props {
  disabled: boolean;
}

const isEnabled: Condition = (value, values) =>
  Boolean(values.integrations.akismet.enabled);

const AkismetConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
      <Localized id="configure-moderation-akismet-title">
        <Header container="legend">Akismet spam detection filter</Header>
      </Localized>
      <Localized
        id="configure-moderation-akismet-explanation"
        strong={<strong />}
      >
        <Typography variant="bodyCopy">
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
          <InputLabel container="legend">Spam detection filter</InputLabel>
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
        validate={validateWhen(isEnabled, required)}
      />

      <FormField>
        <Localized id="configure-moderation-akismet-siteURL">
          <InputLabel htmlFor="configure-moderation-akismet-site">
            Site URL
          </InputLabel>
        </Localized>
        <Field
          name="integrations.akismet.site"
          validate={validateWhen(isEnabled, required)}
        >
          {({ input, meta }) => (
            <>
              <TextField
                id="configure-moderation-akismet-site"
                disabled={disabled}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                color={colorFromMeta(meta)}
                {...input}
              />
              <ValidationMessage meta={meta} />
            </>
          )}
        </Field>
      </FormField>
    </HorizontalGutter>
  );
};

export default AkismetConfig;
