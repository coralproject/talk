import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter, Timestamp } from "coral-ui/components/v2";
import ExternalMedia from "../MediaContainer/ExternalMedia";
import GiphyMedia from "../MediaContainer/GiphyMedia";
import TwitterMedia from "../MediaContainer/TwitterMedia";
import YouTubeMedia from "../MediaContainer/YouTubeMedia";

import { CommentRevisionContainer_comment as CommentData } from "coral-admin/__generated__/CommentRevisionContainer_comment.graphql";

import { CommentContent } from "../Comment";

interface Props {
  comment: CommentData;
}

const CommentRevisionContainer: FunctionComponent<Props> = ({ comment }) => {
  return (
    <HorizontalGutter>
      {comment.revisionHistory
        .concat()
        .reverse()
        .filter((c) =>
          comment && comment.revision && comment.revision.id
            ? comment.revision.id !== c.id
            : true
        )
        .map((c) => (
          <div key={c.id}>
            <Timestamp>{c.createdAt}</Timestamp>
            <CommentContent>{c.body ? c.body : ""}</CommentContent>
            {c.media && c.media.__typename === "GiphyMedia" && (
              <GiphyMedia
                still={c.media.still}
                video={c.media.video}
                title={c.media.title}
                width={c.media.width}
                height={c.media.height}
              />
            )}
            {c.media && c.media.__typename === "ExternalMedia" && (
              <ExternalMedia
                id={comment.id}
                url={c.media.url}
                siteID={comment.site.id}
              />
            )}
            {c.media && c.media.__typename === "TwitterMedia" && (
              <TwitterMedia
                id={comment.id}
                url={c.media.url}
                siteID={comment.site.id}
              />
            )}
            {c.media && c.media.__typename === "YouTubeMedia" && (
              <YouTubeMedia
                id={comment.id}
                url={c.media.url}
                siteID={comment.site.id}
                still={c.media.still}
                title={c.media.title}
              />
            )}
          </div>
        ))}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment CommentRevisionContainer_comment on Comment {
      id
      site {
        id
      }
      revision {
        id
      }
      revisionHistory {
        id
        body
        createdAt
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
})(CommentRevisionContainer);

export default enhanced;
