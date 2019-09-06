import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { FormField, HorizontalGutter, Typography } from "coral-ui/components";

import Header from "../../Header";
import OnOffField from "../../OnOffField";
import SectionContent from "../../SectionContent";

interface Props {
  disabled: boolean;
}

const CommentStreamLiveUpdates: FunctionComponent<Props> = ({ disabled }) => (
  <FormField>
    <HorizontalGutter size="full">
      <Localized id="configure-advanced-liveUpdates">
        <Header container={<label htmlFor="configure-advanced-liveUpdates" />}>
          Comment stream live updates
        </Header>
      </Localized>
      <SectionContent>
        <Localized
          id="configure-advanced-liveUpdates-explanation"
          strong={<strong />}
        >
          <Typography variant="bodyShort">
            When enabled, there will be real-time loading and updating of
            comments as new comments and replies are published
          </Typography>
        </Localized>
        <OnOffField name="live.enabled" disabled={disabled} />
      </SectionContent>
    </HorizontalGutter>
  </FormField>
);

export default CommentStreamLiveUpdates;
