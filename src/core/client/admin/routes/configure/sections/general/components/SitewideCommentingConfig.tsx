import { Localized } from "fluent-react/compat";
import React, { StatelessComponent, Suspense } from "react";
import { Field } from "react-final-form";

import {
  FormField,
  HorizontalGutter,
  InputDescription,
  InputLabel,
  Spinner,
  Typography,
  ValidationMessage,
} from "talk-ui/components";

import OnOffField from "talk-admin/routes/configure/components/OnOffField";
import { MarkdownEditor } from "talk-framework/components/loadables";

import Header from "../../../components/Header";

interface Props {
  disabled: boolean;
}

const SitewideCommentingConfig: StatelessComponent<Props> = ({ disabled }) => (
  <HorizontalGutter size="oneAndAHalf" container="fieldset">
    <Localized id="configure-general-sitewideCommenting-title">
      <Header container="legend">Sitewide Commenting</Header>
    </Localized>
    <Localized id="configure-general-sitewideCommenting-explanation">
      <Typography variant="detail">
        Open or close comment streams for new comments sitewide. When new
        comments are turned off sitewide, new comments cannot be submitted, but
        existing comments can continue to receive “Respect” reactions, be
        reported, and be shared.
      </Typography>
    </Localized>

    <FormField container="fieldset">
      <Localized id="configure-general-sitewideCommenting-enableNewCommentsSitewide">
        <InputLabel container="legend">Enable New Comments Sitewide</InputLabel>
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
          Sitewide Closed Comments Message
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

export default SitewideCommentingConfig;
