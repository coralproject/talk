import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { HorizontalGutter, Timestamp } from "coral-ui/components/v2";

import { CommentRevisionContainer_comment$key as CommentData } from "coral-admin/__generated__/CommentRevisionContainer_comment.graphql";

import { CommentContent } from "../Comment";
import ExternalMedia from "../MediaContainer/ExternalMedia";
import GiphyMedia from "../MediaContainer/GiphyMedia";
import TwitterMedia from "../MediaContainer/TwitterMedia";
import YouTubeMedia from "../MediaContainer/YouTubeMedia";

interface Props {
  comment: CommentData;
}

const CommentRevisionContainer: FunctionComponent<Props> = ({ comment }) => {
  const commentData = useFragment(
    graphql`
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
    comment
  );

  return (
    <HorizontalGutter>
      {commentData.revisionHistory
        .concat()
        .reverse()
        .filter((c) =>
          commentData && commentData.revision && commentData.revision.id
            ? commentData.revision.id !== c.id
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
                id={commentData.id}
                url={c.media.url}
                siteID={commentData.site.id}
              />
            )}
            {c.media && c.media.__typename === "TwitterMedia" && (
              <TwitterMedia
                id={commentData.id}
                url={c.media.url}
                siteID={commentData.site.id}
              />
            )}
            {c.media && c.media.__typename === "YouTubeMedia" && (
              <YouTubeMedia
                id={commentData.id}
                url={c.media.url}
                siteID={commentData.site.id}
                still={c.media.still}
                title={c.media.title}
              />
            )}
          </div>
        ))}
    </HorizontalGutter>
  );
};

export default CommentRevisionContainer;
