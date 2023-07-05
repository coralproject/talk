import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { FormField, FormFieldDescription } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment CommentStreamLiveUpdates_formValues on Settings {
    live {
      enabled
    }
  }
`;

interface Props {
  disabled: boolean;
}

const CommentStreamLiveUpdates: FunctionComponent<Props> = ({ disabled }) => (
  <ConfigBox
    title={
      <Localized id="configure-advanced-liveUpdates">
        <Header htmlFor="configure-advanced-liveUpdates">
          Comment stream live updates
        </Header>
      </Localized>
    }
  >
    <FormField>
      <Localized
        id="configure-advanced-liveUpdates-explanation"
        elems={{ strong: <strong /> }}
      >
        <FormFieldDescription>
          When enabled, there will be real-time loading and updating of comments
          as new comments and replies are published
        </FormFieldDescription>
      </Localized>
      <OnOffField name="live.enabled" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default CommentStreamLiveUpdates;
