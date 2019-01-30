import { Localized } from "fluent-react/compat";
import React, { StatelessComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { ExternalLink } from "talk-framework/lib/i18n/components";
import {
  FormField,
  HorizontalGutter,
  InputLabel,
  Spinner,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import OnOffField from "talk-admin/routes/configure/components/OnOffField";
import Header from "../../../components/Header";
import LazyMarkdown from "./LazyMarkdown";

interface Props {
  disabled: boolean;
}

const GuidelinesConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-guidlines-title">
      <Header>Community Guidelines Summary</Header>
    </Localized>

    <FormField>
      <Localized id="configure-general-guidlines-showCommunityGuidelines">
        <InputLabel>Show Community Guidelines Summary</InputLabel>
      </Localized>
      <OnOffField name="communityGuidelinesEnable" disabled={disabled} />
    </FormField>

    <FormField>
      <Localized id="configure-general-guidlines-title">
        <InputLabel>Community Guidelines Summary</InputLabel>
      </Localized>
      <Localized
        id="configure-general-guidlines-explanation"
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

    <Field name="communityGuidelines">
      {({ input, meta }) => (
        <>
          <Suspense fallback={<Spinner />}>
            <LazyMarkdown onChange={input.onChange} value={input.value} />
          </Suspense>
          {meta.touched &&
            (meta.error || meta.submitError) && (
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
