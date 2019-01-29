import { Localized } from "fluent-react/compat";
import React, { StatelessComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { ExternalLink } from "talk-framework/lib/i18n/components";
import {
  HorizontalGutter,
  Spinner,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import Header from "../../../components/Header";

interface Props {
  disabled: boolean;
}

const LazyMarkdown = React.lazy(() =>
  import("talk-framework/components/loadables/MarkdownEditor")
);

const GuidelinesConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf">
    <Localized id="configure-general-guidlines-title">
      <Header>Community Guidelines Summary</Header>
    </Localized>
    <Localized
      id="configure-general-guidlines-explanation"
      strong={<strong />}
      externalLink={<ExternalLink href="#" />}
    >
      <Typography variant="detail">
        Write a summary of your community guidelines that will appear at the top
        of each comment stream sitewide. Your summary can be formatted using
        Markdown Syntax. More information on how to use Markdown can be found
        here.
      </Typography>
    </Localized>
    <Field name="infoBoxContent">
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
