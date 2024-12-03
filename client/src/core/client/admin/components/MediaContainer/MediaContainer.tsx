import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import BlueskyMedia from "coral-stream/common/Media/BlueskyMedia";

import { MediaContainer_comment } from "coral-admin/__generated__/MediaContainer_comment.graphql";

import ExternalMedia from "./ExternalMedia";
import GifMedia from "./GifMedia";
import TwitterMedia from "./TwitterMedia";
import YouTubeMedia from "./YouTubeMedia";

interface Props {
  comment: MediaContainer_comment;
}

const MediaContainer: FunctionComponent<Props> = ({ comment }) => {
  const media = comment.revision?.media;
  if (!media) {
    return null;
  }

  switch (media.__typename) {
    case "GiphyMedia":
      return (
        <GifMedia
          still={media.still}
          video={media.video}
          title={media.title}
          width={media.width}
          height={media.height}
          url={media.url}
        />
      );
    case "ExternalMedia":
      return (
        <ExternalMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
        />
      );
    case "TwitterMedia":
      return (
        <TwitterMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
        />
      );
    case "BlueskyMedia":
      return (
        <BlueskyMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
        />
      );
    case "YouTubeMedia":
      return (
        <YouTubeMedia
          id={comment.id}
          url={media.url}
          siteID={comment.site.id}
          still={media.still}
          title={media.title}
        />
      );
    case "TenorMedia":
      return (
        <GifMedia
          still={media.tenorStill}
          video={media.tenorVideo}
          title={media.title}
          width={media.width}
          height={media.height}
          url={media.url}
        />
      );
    case "%other":
      return null;
  }
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
          ... on TenorMedia {
            url
            title
            width
            height
            tenorStill: still
            tenorVideo: video
          }
          ... on TwitterMedia {
            url
          }
          ... on BlueskyMedia {
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
