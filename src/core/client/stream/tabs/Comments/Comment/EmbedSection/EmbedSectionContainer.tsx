import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLEMBED_LINK_SOURCE } from "coral-framework/schema";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/OEmbed";
import { Button } from "coral-ui/components/v2";

import { EmbedSectionContainer_comment } from "coral-stream/__generated__/EmbedSectionContainer_comment.graphql";

interface Props {
  comment: EmbedSectionContainer_comment;
}

const EmbedSectionContainer: FunctionComponent<Props> = ({ comment }) => {
  const [expanded, setExpanded] = useState(false);
  const onToggleExpand = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded, setExpanded]);

  if (
    !comment.revision ||
    !comment.revision.embedLinks ||
    comment.revision.embedLinks.length <= 0
  ) {
    return null;
  }

  if (!expanded) {
    return (
      <Localized id="comments-embedLinks-showEmbeds">
        <Button onClick={onToggleExpand}>Show embeds</Button>
      </Localized>
    );
  }

  return (
    <>
      <Localized id="comments-embedLinks-hideEmbeds">
        <Button onClick={onToggleExpand}>Hide embeds</Button>
      </Localized>
      {comment.revision.embedLinks.map((l) =>
        l.source === GQLEMBED_LINK_SOURCE.TWITTER ? (
          <TwitterEmbed url={l.url} />
        ) : (
          <YouTubeEmbed url={l.url} />
        )
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment EmbedSectionContainer_comment on Comment {
      revision {
        embedLinks {
          url
          source
        }
      }
    }
  `,
})(EmbedSectionContainer);

export default enhanced;
