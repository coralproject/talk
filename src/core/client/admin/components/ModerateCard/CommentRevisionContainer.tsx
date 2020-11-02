import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter, Timestamp } from "coral-ui/components/v2";
import Media from "../MediaContainer/Media";

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
            {c.media && c.media.__typename !== "%other" && (
              <Media
                media={c.media}
                id={comment.id}
                siteID={comment.site.id}
                type={c.media.__typename}
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
