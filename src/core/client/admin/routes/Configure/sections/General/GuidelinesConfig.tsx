import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  FieldSet,
  FormField,
  FormFieldHeader,
  HelperText,
  Label,
  Spinner,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";
import ValidationMessage from "../../ValidationMessage";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment GuidelinesConfig_formValues on Settings {
    communityGuidelines {
      enabled
      content
    }
  }
`;

interface Props {
  disabled: boolean;
}

const GuidelinesConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-guidelines-title">
        <Header container={<legend />}>Community guidelines summary</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <FormField>
      <Localized id="configure-general-guidelines-showCommunityGuidelines">
        <Label component="legend">Show community guidelines summary</Label>
      </Localized>
      <OnOffField
        name="communityGuidelines.enabled"
        disabled={disabled}
        testIDs={{
          on: "community-guidelines-on",
          off: "community-guidelines-off",
        }}
      />
    </FormField>

    <FormField>
      <FormFieldHeader>
        <Localized id="configure-general-guidelines-title">
          <Label htmlFor="configure-general-guidelines-content">
            Community guidelines summary
          </Label>
        </Localized>
        <Localized
          id="configure-general-guidelines-explanation"
          elems={{
            strong: <strong />,
            externalLink: <ExternalLink href="#" />,
          }}
        >
          <HelperText>
            Write a summary of your community guidelines that will appear at the
            top of each comment stream sitewide. Your summary can be formatted
            using Markdown Syntax. More information on how to use Markdown can
            be found here.
          </HelperText>
        </Localized>
      </FormFieldHeader>

      <Field name="communityGuidelines.content" parse={parseEmptyAsNull}>
        {({ input, meta }) => (
          <>
            <Suspense fallback={<Spinner />}>
              <MarkdownEditor
                {...input}
                id="configure-general-guidelines-content"
              />
            </Suspense>
            <ValidationMessage meta={meta} />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default GuidelinesConfig;
