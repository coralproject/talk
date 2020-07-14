import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

import { EmbedContainer_comment } from "coral-admin/__generated__/EmbedContainer_comment.graphql";

import GiphyEmbed from "./GiphyEmbed";
import TwitterEmbed from "./TwitterEmbed";
import YoutubeEmbed from "./YoutubeEmbed";

interface Props {
  comment: EmbedContainer_comment;
}

const EmbedContainer: FunctionComponent<Props> = ({ comment }) => {
  if (!comment || !comment.revision || !comment.revision.embed) {
    return null;
  }
  return (
    <>
      {comment.revision.embed.__typename === "GiphyEmbed" && (
        <GiphyEmbed
          still={comment.revision.embed.still}
          video={comment.revision.embed.video}
          title={comment.revision.embed.title}
          width={comment.revision.embed.width}
          height={comment.revision.embed.height}
        />
      )}
      {comment.revision.embed.__typename === "TwitterEmbed" && (
        <TwitterEmbed
          url={comment.revision.embed.url}
          width={comment.revision.embed.width}
        />
      )}
      {comment.revision.embed.__typename === "YoutubeEmbed" && (
        <YoutubeEmbed
          url={comment.revision.embed.url}
          width={comment.revision.embed.width}
          height={comment.revision.embed.height}
        />
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment EmbedContainer_comment on Comment {
      revision {
        embed {
          __typename
          ... on GiphyEmbed {
            url
            title
            width
            height
            still
            video
          }
          ... on TwitterEmbed {
            url
            width
          }
          ... on YoutubeEmbed {
            url
            width
            height
          }
        }
      }
    }
  `,
})(EmbedContainer);

export default enhanced;
