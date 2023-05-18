import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { FormField, FormFieldDescription, Label } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment EmbeddedCommentRepliesConfig_formValues on Settings {
    embeddedComments {
      allowReplies
    }
  }
`;

interface Props {
  disabled: boolean;
}

const EmbeddedCommentRepliesConfig: FunctionComponent<Props> = ({
  disabled,
}) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-embeddedCommentReplies">
        <Header htmlFor="configure-advanced-embeddedCommentReplies">
          Embedded comment replies
        </Header>
      </Localized>
    }
  >
    <FormField>
      <Localized id="configure-advanced-embeddedCommentReplies-explanation">
        <FormFieldDescription>
          When enabled, a reply button will appear with each embedded comment to
          encourage additional discussion on that specific comment or story.
        </FormFieldDescription>
      </Localized>
      <Localized id="configure-advanced-embeddedCommentReplies-label">
        <Label>Allow replies to embedded comments</Label>
      </Localized>
      <OnOffField name="embeddedComments.allowReplies" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default EmbeddedCommentRepliesConfig;
