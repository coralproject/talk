import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";
import { graphql } from "react-relay";

import { MarkdownEditor } from "coral-framework/components/loadables";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import {
  FieldSet,
  FormField,
  FormFieldDescription,
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
  fragment SitewideCommentingConfig_formValues on Settings {
    disableCommenting {
      enabled
      message
    }
  }
`;

interface Props {
  disabled: boolean;
}

const SitewideCommentingConfig: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-general-sitewideCommenting-title">
        <Header container={<legend />}>Sitewide commenting</Header>
      </Localized>
    }
    container={<FieldSet />}
  >
    <Localized id="configure-general-sitewideCommenting-explanation">
      <FormFieldDescription>
        Open or close comment streams for new comments sitewide. When new
        comments are turned off sitewide, new comments cannot be submitted, but
        existing comments can continue to receive “Respect” reactions, be
        reported, and be shared.
      </FormFieldDescription>
    </Localized>

    <FormField>
      <Localized id="configure-general-sitewideCommenting-enableNewCommentsSitewide">
        <Label component="legend">Enable new comments sitewide</Label>
      </Localized>
      <OnOffField
        name="disableCommenting.enabled"
        disabled={disabled}
        invert
        onLabel={
          <Localized id="configure-general-sitewideCommenting-onCommentStreamsOpened">
            <span>On - Comment streams opened for new comments</span>
          </Localized>
        }
        offLabel={
          <Localized id="configure-general-sitewideCommenting-offCommentStreamsClosed">
            <span>Off - Comment streams closed for new comments</span>
          </Localized>
        }
      />
    </FormField>

    <FormField>
      <FormFieldHeader>
        <Localized id="configure-general-sitewideCommenting-message">
          <Label htmlFor="configure-general-sitewideCommenting-message">
            Sitewide closed comments message
          </Label>
        </Localized>
        <Localized id="configure-general-sitewideCommenting-messageExplanation">
          <HelperText>
            Write a message that will be displayed when comment streams are
            closed sitewide
          </HelperText>
        </Localized>
      </FormFieldHeader>

      <Field name="disableCommenting.message" parse={parseEmptyAsNull}>
        {({ input, meta }) => (
          <>
            <Suspense fallback={<Spinner />}>
              <MarkdownEditor
                {...input}
                id="configure-general-sitewideCommenting-message"
              />
            </Suspense>
            <ValidationMessage meta={meta} fullWidth />
          </>
        )}
      </Field>
    </FormField>
  </ConfigBox>
);

export default SitewideCommentingConfig;
