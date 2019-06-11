import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  FieldSet,
  FormField,
  HorizontalGutter,
  InputLabel,
  Spinner,
  Typography,
  ValidationMessage,
} from "coral-ui/components";

import Header from "../../Header";
import OnOffField from "../../OnOffField";

interface Props {
  disabled: boolean;
}

const GuidelinesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container={<FieldSet />}>
    <Localized id="configure-general-guidelines-title">
      <Header container="legend">Community Guidelines Summary</Header>
    </Localized>

    <FormField container={<FieldSet />}>
      <Localized id="configure-general-guidelines-showCommunityGuidelines">
        <InputLabel container="legend">
          Show Community Guidelines Summary
        </InputLabel>
      </Localized>
      <OnOffField name="communityGuidelines.enabled" disabled={disabled} />
    </FormField>

    <FormField>
      <Localized id="configure-general-guidelines-title">
        <InputLabel htmlFor="configure-general-guidelines-content">
          Community Guidelines Summary
        </InputLabel>
      </Localized>
      <Localized
        id="configure-general-guidelines-explanation"
        strong={<strong />}
        externalLink={<ExternalLink href="#" />}
      >
        <Typography variant="detail">
          Write a summary of your community guidelines that will appear at the
          top of each comment stream sitewide. Your summary can be formatted
          using Markdown Syntax. More information on how to use Markdown can be
          found here.
        </Typography>
      </Localized>
    </FormField>

    <Field name="communityGuidelines.content">
      {({ input, meta }) => (
        <>
          <Suspense fallback={<Spinner />}>
            <MarkdownEditor
              id="configure-general-guidelines-content"
              name={input.name}
              onChange={input.onChange}
              value={input.value}
            />
          </Suspense>
          {meta.touched && (meta.error || meta.submitError) && (
            <ValidationMessage>
              {meta.error || meta.submitError}
            </ValidationMessage>
          )}
        </>
      )}
    </Field>
  </HorizontalGutter>
);

export default GuidelinesConfig;
