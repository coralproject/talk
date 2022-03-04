import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { MediaContainer_comment$key as MediaContainer_comment } from "coral-admin/__generated__/MediaContainer_comment.graphql";

import ExternalMedia from "./ExternalMedia";
import GiphyMedia from "./GiphyMedia";
import TwitterMedia from "./TwitterMedia";
import YouTubeMedia from "./YouTubeMedia";

interface Props {
  comment: MediaContainer_comment;
}

const MediaContainer: FunctionComponent<Props> = ({ comment }) => {
  const commentData = useFragment(
    graphql`
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
    comment
  );

  const media = commentData.revision?.media;
  if (!media) {
    return null;
  }

  switch (media.__typename) {
    case "GiphyMedia":
      return (
        <GiphyMedia
          still={media.still}
          video={media.video}
          title={media.title}
          width={media.width}
          height={media.height}
        />
      );
    case "ExternalMedia":
      return (
        <ExternalMedia
          id={commentData.id}
          url={media.url}
          siteID={commentData.site.id}
        />
      );
    case "TwitterMedia":
      return (
        <TwitterMedia
          id={commentData.id}
          url={media.url}
          siteID={commentData.site.id}
        />
      );
    case "YouTubeMedia":
      return (
        <YouTubeMedia
          id={commentData.id}
          url={media.url}
          siteID={commentData.site.id}
          still={media.still}
          title={media.title}
        />
      );
    case "%other":
      return null;
  }
};

export default MediaContainer;
