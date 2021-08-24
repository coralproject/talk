import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";

import { ArchivedReportFlowContainer_comment } from "coral-stream/__generated__/ArchivedReportFlowContainer_comment.graphql";
import { ArchivedReportFlowContainer_settings } from "coral-stream/__generated__/ArchivedReportFlowContainer_settings.graphql";

import PermalinkCopyButton from "../PermalinkButton/PermalinkCopyButton";

import styles from "./ArchivedReportFlowContainer.css";

interface Props {
  settings: ArchivedReportFlowContainer_settings;
  comment: ArchivedReportFlowContainer_comment;
}

const ArchivedReportFlowContainer: FunctionComponent<Props> = ({
  settings,
  comment,
}) => {
  const onCopied = useCallback(() => {}, []);

  const permalinkURL = getURLWithCommentID(comment.story.url, comment.id);

  const subject = "Report comment";
  const emailBody = `
    I would like to report the following comment:
    ${permalinkURL}

    For reasons stated below:
  `;

  return (
    <div className={styles.root}>
      <Localized id="comments-archivedReportPopover-reportThisComment">
        <div className={styles.title}>Report This Comment</div>
      </Localized>

      <Localized
        id="comments-archivedReportPopover-doesThisComment"
        a={
          <a
            href={`mailto:${settings.organization.contactEmail}?subject=${subject}&body=${emailBody}`}
          >
            {settings.organization.url}
          </a>
        }
        $orgURL={settings.organization.url}
      >
        <div className={styles.body}>
          Does this comment violate our community guidelines? Is this offensive
          or spam? Send an email to our moderation team at org email address
          with a link to this comment and a brief explanation.
        </div>
      </Localized>

      <Localized id="comments-archivedReportPopover-needALink">
        <div className={styles.heading}>Need a link to this comment?</div>
      </Localized>

      <PermalinkCopyButton
        onCopied={onCopied}
        permalinkURL={permalinkURL}
        commentID={comment.id}
        variant="outlined"
        paddingSize="extraSmall"
        upperCase
      />
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ArchivedReportFlowContainer_settings on Settings {
      organization {
        url
        contactEmail
      }
    }
  `,
  comment: graphql`
    fragment ArchivedReportFlowContainer_comment on Comment {
      id
      story {
        url
      }
    }
  `,
})(ArchivedReportFlowContainer);

export default enhanced;
