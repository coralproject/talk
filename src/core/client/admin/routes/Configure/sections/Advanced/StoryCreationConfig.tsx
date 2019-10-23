import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  FormField,
  FormFieldHeader,
  Label,
  TextField,
} from "coral-admin/ui/components";
import { parseEmptyAsNull, ValidationMessage } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { validateURL } from "coral-framework/lib/validation";

import ConfigBox from "../../ConfigBox";
import Description from "../../Description";
import Header from "../../Header";
import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";

interface Props {
  disabled: boolean;
}

const StoryCreationConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-stories">
        <Header>Story Creation</Header>
      </Localized>
    }
  >
    <Localized id="configure-advanced-stories-explanation">
      <Description>
        Advanced settings for how stories are created within Coral
      </Description>
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
          externalLink={
            <ExternalLink href="https://www.npmjs.com/package/proxy-agent" />
          }
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
          <>
            <TextField
              id="configure-advanced-stories-proxy-url"
              disabled={disabled}
              fullWidth
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              {...input}
            />
            <ValidationMessage meta={meta} />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default StoryCreationConfig;
