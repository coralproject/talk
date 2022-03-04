import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { CopyButton } from "coral-framework/components";
import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { getLocationOrigin } from "coral-framework/utils";
import { Icon } from "coral-ui/components/v2";

import { LinkDetailsContainer_comment$key as LinkDetailsContainer_comment } from "coral-admin/__generated__/LinkDetailsContainer_comment.graphql";

import styles from "./LinkDetailsContainer.css";

interface Props {
  comment: LinkDetailsContainer_comment;
}

const LinkDetailsContainer: FunctionComponent<Props> = ({ comment }) => {
  const commentData = useFragment(
    graphql`
      fragment LinkDetailsContainer_comment on Comment {
        id
        story {
          id
          url
        }
      }
    `,
    comment
  );

  const { window } = useCoralContext();
  return (
    <>
      <div className={styles.label}>
        <Localized id="moderate-linkDetails-label">
          Copy link to this comment
        </Localized>
      </div>
      <div className={styles.buttonContainer}>
        <CopyButton
          text={getURLWithCommentID(commentData.story.url, commentData.id)}
          variant="regular"
          color="regular"
          innerCopied={
            <>
              <Icon size="md">check</Icon>
              <Localized id="framework-copyButton-copied">
                <span>Copied!</span>
              </Localized>
            </>
          }
          inner={
            <>
              <Icon size="md">link</Icon>
              <Localized id="moderate-in-stream-link-copy">
                <span>In Stream</span>
              </Localized>
            </>
          }
        ></CopyButton>
      </div>
      <div className={styles.buttonContainer}>
        <CopyButton
          text={`${getLocationOrigin(window)}/admin/moderate/comment/${
            commentData.id
          }`}
          variant="regular"
          color="regular"
          innerCopied={
            <>
              <Icon size="md">check</Icon>
              <Localized id="framework-copyButton-copied">
                <span>Copied!</span>
              </Localized>
            </>
          }
          inner={
            <>
              <Icon size="md">link</Icon>
              <Localized id="moderate-in-moderation-link-copy">
                <span>In Moderation</span>
              </Localized>
            </>
          }
        ></CopyButton>
      </div>
    </>
  );
};

export default LinkDetailsContainer;
