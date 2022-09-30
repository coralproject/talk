import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { parseEmptyAsNull } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
  HelperText,
  HorizontalGutter,
  Label,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import Subheader from "../../Subheader";
import TextFieldWithValidation from "../../TextFieldWithValidation";
import APIKeyField from "./APIKeyField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment AkismetConfig_formValues on Settings {
    integrations {
      akismet {
        enabled
        ipBased
        key
        site
      }
    }
  }
`;

interface Props {
  disabled: boolean;
}

const isEnabled: Condition = (value, values) =>
  Boolean(values.integrations.akismet.enabled);

const AkismetConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <ConfigBox
      container={<FieldSet />}
      data-testid="akismet-config"
      title={
        <Localized id="configure-moderation-akismet-title">
          <Header container={<legend />}>Spam detection filter</Header>
        </Localized>
      }
    >
      <Localized
        id="configure-moderation-akismet-explanation"
        elems={{ strong: <strong /> }}
      >
        <FormFieldDescription>
          Submitted comments are passed to the Akismet API for spam detection.
          If a comment is determined to be spam, it will prompt the user,
          indicating that the comment might be considered spam. If the user
          continues after this point with the still spam-like comment, the
          comment will be marked as containing spam, will not be published and
          are placed in the Pending Queue for review by a moderator. If approved
          by a moderator, the comment will be published.
        </FormFieldDescription>
      </Localized>

      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-akismet-filter">
          <Label component="legend">Spam detection filter</Label>
        </Localized>
        <OnOffField name="integrations.akismet.enabled" disabled={disabled} />
      </FormField>
      <FormField container={<FieldSet />}>
        <Localized id="configure-moderation-akismet-ipBased">
          <Label component="legend">IP-based spam detection</Label>
        </Localized>
        <OnOffField name="integrations.akismet.ipBased" disabled={disabled} />
      </FormField>
      <HorizontalGutter spacing={3}>
        <Localized
          id="configure-configurationSubHeader"
          elems={{ strong: <strong /> }}
        >
          <Subheader>Configuration</Subheader>
        </Localized>
        <Localized
          id="configure-moderation-akismet-accountNote"
          elems={{ externalLink: <ExternalLink /> }}
        >
          <HelperText>
            Note: You must add your active domain(s) in your Akismet account:
            https://akismet.com/account/
          </HelperText>
        </Localized>
      </HorizontalGutter>
      <APIKeyField
        name="integrations.akismet.key"
        disabled={disabled}
        validate={validateWhen(isEnabled, required)}
      />

      <FormField>
        <Localized id="configure-moderation-akismet-siteURL">
          <Label htmlFor="configure-moderation-akismet-site">Site URL</Label>
        </Localized>
        <Field
          name="integrations.akismet.site"
          parse={parseEmptyAsNull}
          validate={validateWhen(isEnabled, required)}
        >
          {({ input, meta }) => (
            <TextFieldWithValidation
              {...input}
              id="configure-moderation-akismet-site"
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              fullWidth
              meta={meta}
            />
          )}
        </Field>
      </FormField>
    </ConfigBox>
  );
};

export default AkismetConfig;
