import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { DeepNullable } from "coral-common/types";
import {
  colorFromMeta,
  parseEmptyAsNull,
  ValidationMessage,
} from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  composeValidatorsWhen,
  Condition,
  required,
  validateURL,
} from "coral-framework/lib/validation";
import { GQLSettings } from "coral-framework/schema";
import {
  FormField,
  FormFieldDescription,
  FormFieldHeader,
  Label,
  PasswordField,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";
import Subheader from "../../Subheader";
import TextFieldWithValidation from "../../TextFieldWithValidation";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment StoryCreationConfig_formValues on Settings {
    stories {
      scraping {
        enabled
        proxyURL
        customUserAgent
        authentication
        username
        password
      }
      disableLazy
    }
  }
`;

interface Props {
  disabled: boolean;
}

export type FormProps = DeepNullable<Pick<GQLSettings, "stories">>;

const isEnabled: Condition<any, FormProps> = (value, values) =>
  Boolean(
    values.stories && values.stories.scraping && values.stories.scraping.enabled
  );

const isAuthenticating: Condition<any, FormProps> = (value, values) =>
  Boolean(
    values.stories.scraping.enabled && values.stories.scraping.authentication
  );

const StoryCreationConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-stories">
        <Header container="h2">Story Creation</Header>
      </Localized>
    }
  >
    <Localized id="configure-advanced-stories-explanation">
      <FormFieldDescription>
        Advanced settings for how stories are created within Coral
      </FormFieldDescription>
    </Localized>
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-advanced-stories-lazy">
          <Label>Lazy story creation</Label>
        </Localized>
        <Localized id="configure-advanced-stories-lazy-detail">
          <HelperText>
            Enable stories to be automatically created when they are published
            from your CMS.
          </HelperText>
        </Localized>
      </FormFieldHeader>
      <OnOffField invert name="stories.disableLazy" disabled={disabled} />
    </FormField>
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-advanced-stories-scraping">
          <Label>Story scraping</Label>
        </Localized>
        <Localized id="configure-advanced-stories-scraping-detail">
          <HelperText>
            Enable story metadata to be automatically scraped when they are
            published from your CMS.
          </HelperText>
        </Localized>
      </FormFieldHeader>
      <OnOffField name="stories.scraping.enabled" disabled={disabled} />
    </FormField>
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-advanced-stories-proxy">
          <Label htmlFor="configure-advanced-stories-proxy-url">
            Scraper proxy URL
          </Label>
        </Localized>
        <Localized
          id="configure-advanced-stories-proxy-detail"
          elems={{
            externalLink: (
              <ExternalLink href="https://www.npmjs.com/package/proxy-agent" />
            ),
          }}
        >
          <HelperText>
            When specified, allows scraping requests to use the provided proxy.
            All requests will then be passed through the appropriote proxy as
            parsed by the npm proxy-agent package.
          </HelperText>
        </Localized>
      </FormFieldHeader>
      <Field
        name="stories.scraping.proxyURL"
        parse={parseEmptyAsNull}
        validate={validateURL}
      >
        {({ input, meta }) => (
          <TextFieldWithValidation
            {...input}
            id="configure-advanced-stories-proxy-url"
            disabled={disabled}
            fullWidth
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            meta={meta}
          />
        )}
      </Field>
    </FormField>
    <FormField>
      <FormFieldHeader>
        <Localized id="configure-advanced-stories-custom-user-agent">
          <Label htmlFor="configure-advanced-stories-custom-user-agent">
            Custom Scraper User Agent Header
          </Label>
        </Localized>
        <Localized
          id="configure-advanced-stories-custom-user-agent-detail"
          elems={{ code: <code /> }}
        >
          <HelperText>
            When specified, overrides the <code>User-Agent</code> header sent
            with each scrape request.
          </HelperText>
        </Localized>
      </FormFieldHeader>
      <Field name="stories.scraping.customUserAgent" parse={parseEmptyAsNull}>
        {({ input, meta }) => (
          <TextFieldWithValidation
            {...input}
            id="configure-advanced-stories-custom-user-agent"
            disabled={disabled}
            fullWidth
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            meta={meta}
          />
        )}
      </Field>
    </FormField>
    <FormField>
      <Localized id="configure-advanced-stories-authentication">
        <Label>Authentication</Label>
      </Localized>
      <OnOffField
        name="stories.scraping.authentication"
        disabled={disabled}
        validate={composeValidatorsWhen(isEnabled, required)}
      />
    </FormField>
    <Field
      name="stories.scraping.authentication"
      subscription={{ value: true }}
    >
      {({ input: { value: enabled } }) => (
        <>
          <Localized id="configure-advanced-stories-scrapingCredentialsHeader">
            <Subheader>Scraping credentials</Subheader>
          </Localized>
          <FormField>
            <Localized id="configure-advanced-stories-scraping-usernameLabel">
              <Label>Username</Label>
            </Localized>
            <Field
              name="stories.scraping.username"
              parse={parseEmptyAsNull}
              validate={composeValidatorsWhen(isAuthenticating, required)}
            >
              {({ input, meta }) => (
                <TextFieldWithValidation
                  {...input}
                  id={input.name}
                  disabled={disabled || !enabled}
                  fullWidth
                  meta={meta}
                />
              )}
            </Field>
          </FormField>
          <FormField>
            <Localized id="configure-advanced-stories-scraping-passwordLabel">
              <Label>Password</Label>
            </Localized>
            <Field
              name="stories.scraping.password"
              parse={parseEmptyAsNull}
              validate={composeValidatorsWhen(isAuthenticating, required)}
            >
              {({ input, meta }) => (
                <>
                  <PasswordField
                    {...input}
                    id={input.name}
                    disabled={disabled || !enabled}
                    autoComplete="new-password"
                    fullWidth
                    color={colorFromMeta(meta)}
                  />
                  <ValidationMessage fullWidth meta={meta} />
                </>
              )}
            </Field>
          </FormField>
        </>
      )}
    </Field>
  </ConfigBox>
);

export default StoryCreationConfig;
