import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

import { EmbedContainer_comment } from "coral-admin/__generated__/EmbedContainer_comment.graphql";

import Embed from "./Embed";

interface Props {
  comment: EmbedContainer_comment;
}

const EmbedContainer: FunctionComponent<Props> = ({ comment }) => {
  if (!comment || !comment.revision || !comment.revision.embeds) {
    return null;
  }
  return (
    <>
      {comment.revision.embeds.map((embed) => (
        <Embed
          url={embed.url}
          key={embed.url}
          type={embed.source}
          title={embed.title}
          still={embed.media ? embed.media.still : null}
        />
      ))}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment EmbedContainer_comment on Comment {
      revision {
        embeds {
          url
          source
          title
          media {
            original
            still
          }
        }
      }
    }
  `,
})(EmbedContainer);

export default enhanced;
