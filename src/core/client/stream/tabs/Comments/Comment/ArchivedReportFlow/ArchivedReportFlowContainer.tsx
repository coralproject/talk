import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import CLASSES from "coral-stream/classes";

import { ArchivedReportFlowContainer_comment$key as ArchivedReportFlowContainer_comment } from "coral-stream/__generated__/ArchivedReportFlowContainer_comment.graphql";
import { ArchivedReportFlowContainer_settings$key as ArchivedReportFlowContainer_settings } from "coral-stream/__generated__/ArchivedReportFlowContainer_settings.graphql";

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
  const settingsData = useFragment(
    graphql`
      fragment ArchivedReportFlowContainer_settings on Settings {
        organization {
          name
          contactEmail
        }
      }
    `,
    settings
  );
  const commentData = useFragment(
    graphql`
      fragment ArchivedReportFlowContainer_comment on Comment {
        id
        story {
          url
        }
      }
    `,
    comment
  );

  const { localeBundles } = useCoralContext();

  const permalinkURL = getURLWithCommentID(
    commentData.story.url,
    commentData.id
  );

  const subject = getMessage(
    localeBundles,
    "comments-archivedReportPopover-emailSubject",
    "Report comment"
  );
  const emailBody = getMessage(
    localeBundles,
    "comments-archivedReportPopover-emailBody",
    `
      I would like to report the following comment:
      %0A
      ${permalinkURL}
      %0A
      %0A
      For the reasons stated below:
    `,
    {
      permalinkURL,
    }
  );

  return (
    <div className={styles.root}>
      <Localized id="comments-archivedReportPopover-reportThisComment">
        <div className={styles.title}>Report This Comment</div>
      </Localized>

      <Localized
        id="comments-archivedReportPopover-doesThisComment"
        a={
          <a
            href={`mailto:${settingsData.organization.contactEmail}?subject=${subject}&body=${emailBody}`}
          >
            {settingsData.organization.name}
          </a>
        }
        $orgName={settingsData.organization.name}
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
        permalinkURL={permalinkURL}
        commentID={commentData.id}
        variant="outlined"
        paddingSize="extraSmall"
        upperCase
        className={CLASSES.reportPopover.copyButton}
      />
    </div>
  );
};

export default ArchivedReportFlowContainer;
