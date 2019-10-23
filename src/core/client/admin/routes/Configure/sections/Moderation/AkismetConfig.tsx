import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FieldSet,
  FormField,
  HelperText,
  Label,
  TextField,
} from "coral-admin/ui/components";
import { colorFromMeta, parseEmptyAsNull } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Condition,
  required,
  validateWhen,
} from "coral-framework/lib/validation";
import { HorizontalGutter } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import SectionContent from "../../SectionContent";
import SubHeader from "../../SubHeader";
import ValidationMessage from "../../ValidationMessage";
import APIKeyField from "./APIKeyField";

interface Props {
  disabled: boolean;
}

const isEnabled: Condition = (value, values) =>
  Boolean(values.integrations.akismet.enabled);

const AkismetConfig: FunctionComponent<Props> = ({ disabled }) => {
  return (
    <HorizontalGutter
      size="oneAndAHalf"
      container={<FieldSet />}
      data-testid="akismet-config"
    >
      <Localized id="configure-moderation-akismet-title">
        <Header component="legend">Spam detection filter</Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-moderation-akismet-explanation"
          strong={<strong />}
        >
          <Description>
            Submitted comments are passed to the Akismet API for spam detection.
            If a comment is determined to be spam, it will prompt the user,
            indicating that the comment might be considered spam. If the user
            continues after this point with the still spam-like comment, the
            comment will be marked as containing spam, will not be published and
            are placed in the Pending Queue for review by a moderator. If
            approved by a moderator, the comment will be published.
          </Description>
        </Localized>

        <FormField container={<FieldSet />}>
          <Localized id="configure-moderation-akismet-filter">
            <Label component="legend">Spam detection filter</Label>
          </Localized>
          <OnOffField name="integrations.akismet.enabled" disabled={disabled} />
        </FormField>
        <HorizontalGutter spacing={3}>
          <Localized id="configure-configurationSubHeader" strong={<strong />}>
            <SubHeader>Configuration</SubHeader>
          </Localized>
          <Localized
            id="configure-moderation-akismet-accountNote"
            externalLink={<ExternalLink />}
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
              <>
                <TextField
                  id="configure-moderation-akismet-site"
                  disabled={disabled}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  color={colorFromMeta(meta)}
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

export default AkismetConfig;
