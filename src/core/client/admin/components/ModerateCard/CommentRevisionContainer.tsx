import React, { FunctionComponent } from "react";

import { CommentRevisionContainer_comment as CommentData } from "coral-admin/__generated__/CommentRevisionContainer_comment.graphql";
import { CommentRevisionContainer_settings as SettingsData } from "coral-admin/__generated__/CommentRevisionContainer_settings.graphql";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter, Timestamp } from "coral-ui/components";

import CommentContent from "./CommentContent";

interface Props {
  comment: CommentData;
  settings: SettingsData;
}

const CommentRevisionContainer: FunctionComponent<Props> = ({
  settings,
  comment,
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
              suspectWords={settings.wordList.suspect}
              bannedWords={settings.wordList.banned}
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
  settings: graphql`
    fragment CommentRevisionContainer_settings on Settings {
      wordList {
        banned
        suspect
      }
    }
  `,
})(CommentRevisionContainer);

export default enhanced;
