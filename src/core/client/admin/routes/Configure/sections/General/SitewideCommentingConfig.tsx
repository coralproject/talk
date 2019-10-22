import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { FormField, Label } from "coral-admin/ui/components";
import { MarkdownEditor } from "coral-framework/components/loadables";
import { parseEmptyAsNull } from "coral-framework/lib/form";
import { HorizontalGutter, Spinner } from "coral-ui/components";

import Description from "../../Description";
import Header from "../../Header";
import HelperText from "../../HelperText";
import OnOffField from "../../OnOffField";
import SectionContent from "../../SectionContent";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const SitewideCommentingConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter spacing={3} container="fieldset">
    <Localized id="configure-general-sitewideCommenting-title">
      <Header component="legend">Sitewide commenting</Header>
    </Localized>
    <SectionContent>
      <Localized id="configure-general-sitewideCommenting-explanation">
        <Description>
          Open or close comment streams for new comments sitewide. When new
          comments are turned off sitewide, new comments cannot be submitted,
          but existing comments can continue to receive “Respect” reactions, be
          reported, and be shared.
        </Description>
      </Localized>

      <FormField container="fieldset">
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

      <HorizontalGutter spacing={2}>
        <FormField>
          <HorizontalGutter spacing={1}>
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
          </HorizontalGutter>
        </FormField>

        <Field name="disableCommenting.message" parse={parseEmptyAsNull}>
          {({ input, meta }) => (
            <>
              <Suspense fallback={<Spinner />}>
                <MarkdownEditor
                  id="configure-general-sitewideCommenting-message"
                  {...input}
                />
              </Suspense>
              <ValidationMessage meta={meta} fullWidth />
            </>
          )}
        </Field>
      </HorizontalGutter>
    </SectionContent>
  </HorizontalGutter>
);

export default SitewideCommentingConfig;
