import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {} from "coral-ui/components/v2";

import { MediaContainer_comment } from "coral-admin/__generated__/MediaContainer_comment.graphql";

import ExternalMedia from "./ExternalMedia";
import GiphyMedia from "./GiphyMedia";
import TwitterMedia from "./TwitterMedia";
import YouTubeMedia from "./YouTubeMedia";

interface Props {
  comment: MediaContainer_comment;
}

const MediaContainer: FunctionComponent<Props> = ({ comment }) => {
  if (!comment || !comment.revision || !comment.revision.media) {
    return null;
  }
  return (
    <>
      {comment.revision.media.__typename === "GiphyMedia" && (
        <GiphyMedia
          still={comment.revision.media.still}
          video={comment.revision.media.video}
          title={comment.revision.media.title}
          width={comment.revision.media.width}
          height={comment.revision.media.height}
        />
      )}
      {comment.revision.media.__typename === "ExternalMedia" && (
        <ExternalMedia
          url={comment.revision.media.url}
          siteID={comment.site.id}
        />
      )}
      {comment.revision.media.__typename === "TwitterMedia" && (
        <TwitterMedia
          url={comment.revision.media.url}
          width={comment.revision.media.width}
          siteID={comment.site.id}
        />
      )}
      {comment.revision.media.__typename === "YouTubeMedia" && (
        <YouTubeMedia
          url={comment.revision.media.url}
          width={comment.revision.media.width}
          height={comment.revision.media.height}
          siteID={comment.site.id}
          still={comment.revision.media.still}
          title={comment.revision.media.title}
        />
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment MediaContainer_comment on Comment {
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
            width
          }
          ... on YouTubeMedia {
            url
            still
            title
            width
            height
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
