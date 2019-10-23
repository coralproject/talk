import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { FormField } from "coral-admin/ui/components";

import ConfigBox from "../../ConfigBox";
import Description from "../../Description";
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
        <Description>
          When enabled, there will be real-time loading and updating of comments
          as new comments and replies are published
        </Description>
      </Localized>
      <OnOffField name="live.enabled" disabled={disabled} />
    </FormField>
  </ConfigBox>
);

export default CommentStreamLiveUpdates;
