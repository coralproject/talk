import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { CopyButton } from "coral-framework/components";
import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { getLocationOrigin } from "coral-framework/utils";
import { Icon } from "coral-ui/components/v2";

import { LinkDetailsContainer_comment } from "coral-admin/__generated__/LinkDetailsContainer_comment.graphql";
import { LinkDetailsContainer_settings } from "coral-admin/__generated__/LinkDetailsContainer_settings.graphql";

import styles from "./LinkDetailsContainer.css";

interface Props {
  comment: LinkDetailsContainer_comment;
  settings: LinkDetailsContainer_settings;
}

const LinkDetailsContainer: FunctionComponent<Props> = ({
  comment,
  settings,
}) => {
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
          text={getURLWithCommentID(comment.story.url, comment.id)}
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
            comment.id
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

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment LinkDetailsContainer_comment on Comment {
      id
      story {
        id
        url
      }
    }
  `,
  settings: graphql`
    fragment LinkDetailsContainer_settings on Settings {
      organization {
        url
      }
    }
  `,
})(LinkDetailsContainer);

export default enhanced;
