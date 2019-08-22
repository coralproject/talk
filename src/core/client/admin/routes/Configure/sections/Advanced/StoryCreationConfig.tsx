import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { ValidationMessage } from "coral-framework/lib/form";
import { validateURL } from "coral-framework/lib/validation";
import {
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
} from "coral-ui/components";
import OnOffField from "../../OnOffField";

import Header from "../../Header";

interface Props {
  disabled: boolean;
}

const StoryCreationConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="double">
    <HorizontalGutter size="full">
      <Localized id="configure-advanced-stories">
        <Header>Story Creation</Header>
      </Localized>
      <Localized id="configure-advanced-stories-explanation">
        <Typography variant="detail">Details</Typography>
      </Localized>
    </HorizontalGutter>
    <HorizontalGutter size="double">
      <FormField>
        <HorizontalGutter size="full">
          <Localized id="configure-advanced-stories-lazy">
            <InputLabel>Lazy story creation</InputLabel>
          </Localized>
          <Localized id="configure-advanced-stories-lazy-detail">
            <Typography variant="detail">Details</Typography>
          </Localized>
          <OnOffField invert name="stories.disableLazy" disabled={disabled} />
        </HorizontalGutter>
      </FormField>
      <FormField>
        <HorizontalGutter size="full">
          <Localized id="configure-advanced-stories-scraping">
            <InputLabel>Story scraping</InputLabel>
          </Localized>
          <Localized id="configure-advanced-stories-scraping-detail">
            <Typography variant="detail">Details</Typography>
          </Localized>
          <OnOffField name="stories.scraping.enabled" disabled={disabled} />
        </HorizontalGutter>
      </FormField>
      <FormField>
        <HorizontalGutter size="full">
          <Localized id="configure-advanced-stories-proxy">
            <InputLabel htmlFor="configure-advanced-stories-proxy-url">
              Scraper proxy URL
            </InputLabel>
          </Localized>
          <Localized id="configure-advanced-stories-proxy-detail">
            <Typography variant="detail">
              When specified, allows scraping requests to use the provided
              proxy. All requests will then be passed through the appropriote
              proxy as parsed by the npm proxy-agent package.
            </Typography>
          </Localized>
          <Field name="stories.scraping.proxyURL" validate={validateURL}>
            {({ input, meta }) => (
              <>
                <TextField
                  id="configure-advanced-stories-proxy-url"
                  disabled={disabled}
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
        </HorizontalGutter>
      </FormField>
    </HorizontalGutter>
  </HorizontalGutter>
);

export default StoryCreationConfig;
