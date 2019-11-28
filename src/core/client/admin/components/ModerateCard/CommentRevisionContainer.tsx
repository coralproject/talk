import React, { FunctionComponent } from "react";

import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter, Timestamp } from "coral-ui/components/v2";

import { CommentRevisionContainer_comment as CommentData } from "coral-admin/__generated__/CommentRevisionContainer_comment.graphql";
import { CommentRevisionContainer_organization as OrganizationData } from "coral-admin/__generated__/CommentRevisionContainer_organization.graphql";

import CommentContent from "./CommentContent";

interface Props {
  comment: CommentData;
  organization: OrganizationData;
}

const CommentRevisionContainer: FunctionComponent<Props> = ({
  comment,
  organization,
}) => {
  return (
    <HorizontalGutter>
      {comment.revisionHistory
        .concat()
        .reverse()
        .filter(c =>
          comment && comment.revision && comment.revision.id
            ? comment.revision.id !== c.id
            : true
        )
        .map(c => (
          <div key={c.id}>
            <Timestamp>{c.createdAt}</Timestamp>
            <CommentContent
              suspectWords={organization.settings.wordList.suspect}
              bannedWords={organization.settings.wordList.banned}
            >
              {c.body ? c.body : ""}
            </CommentContent>
          </div>
        ))}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment CommentRevisionContainer_comment on Comment {
      revision {
        id
      }
      revisionHistory {
        id
        body
        createdAt
      }
    }
  `,
  organization: graphql`
    fragment CommentRevisionContainer_organization on Organization {
      settings {
        wordList {
          banned
          suspect
        }
      }
    }
  `,
})(CommentRevisionContainer);

export default enhanced;
