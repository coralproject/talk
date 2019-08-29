import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, Suspense } from "react";
import { Field } from "react-final-form";

import { MarkdownEditor } from "coral-framework/components/loadables";
import {
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  Spinner,
  Typography,
} from "coral-ui/components";

import Header from "../../Header";
import OnOffField from "../../OnOffField";
import ValidationMessage from "../../ValidationMessage";

interface Props {
  disabled: boolean;
}

const SitewideCommentingConfig: FunctionComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container="fieldset">
    <Localized id="configure-general-sitewideCommenting-title">
      <Header container="legend">Sitewide commenting</Header>
    </Localized>
    <Localized id="configure-general-sitewideCommenting-explanation">
      <Typography variant="bodyCopy">
        Open or close comment streams for new comments sitewide. When new
        comments are turned off sitewide, new comments cannot be submitted, but
        existing comments can continue to receive “Respect” reactions, be
        reported, and be shared.
      </Typography>
    </Localized>

    <FormField container="fieldset">
      <Localized id="configure-general-sitewideCommenting-enableNewCommentsSitewide">
        <InputLabel container="legend">Enable new comments sitewide</InputLabel>
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
      <Localized id="configure-general-sitewideCommenting-message">
        <InputLabel htmlFor="configure-general-sitewideCommenting-message">
          Sitewide closed comments message
        </InputLabel>
      </Localized>
      <Localized id="configure-general-sitewideCommenting-messageExplanation">
        <InputDescription>
          Write a message that will be displayed when comment streams are closed
          sitewide
        </InputDescription>
      </Localized>
    </FormField>

    <Field name="disableCommenting.message">
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
);

export default SitewideCommentingConfig;
