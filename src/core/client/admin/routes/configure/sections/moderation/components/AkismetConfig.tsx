import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { validateURL } from "talk-framework/lib/validation";
import {
  FormField,
  HorizontalGutter,
  InputLabel,
  TextField,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import ConfigurationSubHeader from "../../../components/ConfigurationSubHeader";
import Header from "../../../components/Header";
import OnOffField from "../../../components/OnOffField";
import APIKeyField from "./APIKeyField";
import ExternalLink from "./ExternalLink";

interface Props {
  disabled: boolean;
}

const AkismetConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-moderation-akismet-title">
      <Header>Akismet Spam Detection Filter</Header>
    </Localized>
    <Localized
      id="configure-moderation-akismet-explanation"
      strong={<strong />}
    >
      <Typography variant="detail">
        Submitted comments are passed to the Akismet API for spam detection. If
        a comment is determined to be spam, it will prompt the user, indicating
        that the comment might be considered spam. If the user continues after
        this point with the still spam-like comment, the comment will be marked
        as containing spam, will not be published and are placed in the Pending
        Queue for review by a moderator. If approved by a moderator, the comment
        will be published.
      </Typography>
    </Localized>

    <FormField>
      <Localized id="configure-moderation-akismet-filter">
        <InputLabel>Spam Detection Filter</InputLabel>
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
    <APIKeyField name="integrations.akismet.key" disabled={disabled} />

    <FormField>
      <Localized id="configure-moderation-akismet-siteURL">
        <InputLabel>Site URL</InputLabel>
      </Localized>
      <Field name={"integrations.akismet.site"} validate={validateURL}>
        {({ input, meta }) => (
          <>
            <TextField
              name={input.name}
              onChange={input.onChange}
              value={input.value}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {meta.touched &&
              (meta.error || meta.submitError) && (
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

export default AkismetConfig;
