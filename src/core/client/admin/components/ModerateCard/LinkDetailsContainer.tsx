import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { getURLWithCommentID } from "coral-framework/helpers";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { getLocationOrigin } from "coral-framework/utils";
import { Button, Icon } from "coral-ui/components";

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
  return (
    <>
      <div className={styles.label}>
        <Localized id="moderate-linkDetails-label">
          Copy link to this comment
        </Localized>
      </div>
      <div className={styles.buttonContainer}>
        <CopyToClipboard
          text={getURLWithCommentID(comment.story.url, comment.id)}
        >
          <Button
            color="primary"
            variant="filled"
            size="small"
            className={styles.button}
          >
            <Icon size="md">link</Icon>
            <Localized id="moderate-in-stream-link-copy">
              <span>In Stream</span>
            </Localized>
          </Button>
        </CopyToClipboard>
      </div>
      <div className={styles.buttonContainer}>
        <CopyToClipboard
          text={`${getLocationOrigin()}/admin/moderate/comment/${comment.id}`}
        >
          <Button
            color="primary"
            variant="filled"
            size="small"
            className={styles.button}
          >
            <Icon size="md">link</Icon>
            <Localized id="moderate-in-moderation-link-copy">
              <span>In Moderation</span>
            </Localized>
          </Button>
        </CopyToClipboard>
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
