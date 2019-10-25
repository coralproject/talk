import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { FormField, FormFieldDescription } from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import OnOffField from "../../OnOffField";

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
        strong={<strong />}
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
