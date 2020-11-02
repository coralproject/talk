import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { MediaContainer_comment } from "coral-admin/__generated__/MediaContainer_comment.graphql";

import Media from "./Media";

interface Props {
  comment: MediaContainer_comment;
}

const MediaContainer: FunctionComponent<Props> = ({ comment }) => {
  const media = comment.revision?.media;
  if (!media) {
    return null;
  }

  if (media.__typename === "%other") {
    return null;
  }

  return (
    <Media
      media={media}
      type={media.__typename}
      id={comment.id}
      siteID={comment.site.id}
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment MediaContainer_comment on Comment {
      id
      site {
        id
      }
      revision {
        media {
          __typename
          ... on GiphyMedia {
            url
            title
            width
            height
            still
            video
          }
          ... on TwitterMedia {
            url
          }
          ... on YouTubeMedia {
            url
            still
            title
          }
          ... on ExternalMedia {
            url
          }
        }
      }
    }
  `,
})(MediaContainer);

export default enhanced;
