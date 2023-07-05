import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Flex,
  HorizontalGutter,
  Icon,
  Tab,
  TabBar,
} from "coral-ui/components/v2";

import { ModerateCardDetailsContainer_comment } from "coral-admin/__generated__/ModerateCardDetailsContainer_comment.graphql";
import { ModerateCardDetailsContainer_settings } from "coral-admin/__generated__/ModerateCardDetailsContainer_settings.graphql";

import AutomatedActionsContainer from "./AutomatedActionsContainer";
import CommentRevisionContainer from "./CommentRevisionContainer";
import FlagDetailsContainer from "./FlagDetailsContainer";
import LinkDetailsContainer from "./LinkDetailsContainer";
import ReactionDetailsQuery from "./ReactionDetailsQuery";

import styles from "./ModerateCardDetailsContainer.css";

interface Props {
  comment: ModerateCardDetailsContainer_comment;
  settings: ModerateCardDetailsContainer_settings;
  onUsernameClick: (id?: string) => void;
}

type DetailsTabs = "INFO" | "REACTIONS" | "HISTORY" | "EXTERNAL_MOD";

function hasFlagDetails(c: ModerateCardDetailsContainer_comment) {
  return c.revision
    ? c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_ABUSIVE +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OTHER +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_BIO +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM >
        0 || c.revision.metadata.perspective
    : false;
}

const ModerateCardDetailsContainer: FunctionComponent<Props> = ({
  comment,
  onUsernameClick,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<DetailsTabs>("INFO");

  const onTabClick = useCallback(
    (id: string) => setActiveTab(id as DetailsTabs),
    [setActiveTab]
  );

  const doesHaveFlagDetails = useMemo(() => hasFlagDetails(comment), [comment]);
  const hasRevisions = comment.editing.edited;
  const hasAutomatedActions = !!(
    comment &&
    comment.revision &&
    comment.revision.metadata &&
    ((comment.revision.metadata.perspective &&
      comment.revision.metadata.perspective.score > 0) ||
      (comment.revision.metadata.externalModeration &&
        comment.revision.metadata.externalModeration.length > 0))
  );
  const hasReactions = !!(
    comment &&
    comment.revision &&
    comment.revision.actionCounts.reaction.total > 0
  );

  return (
    <HorizontalGutter>
      <TabBar variant="default" activeTab={activeTab} onTabClick={onTabClick}>
        <Tab tabID="INFO" classes={styles}>
          <Flex alignItems="center" itemGutter>
            <Icon size="md">list</Icon>
            <Localized id="moderateCardDetails-tab-info">
              <span>Info</span>
            </Localized>
          </Flex>
        </Tab>
        {hasReactions && (
          <Tab tabID="REACTIONS" classes={styles}>
            <Flex alignItems="center" itemGutter>
              <Icon size="md">thumb_up</Icon>
              <Localized id="moderateCardDetails-tab-reactions">
                <span>Reactions</span>
              </Localized>
            </Flex>
          </Tab>
        )}
        {hasRevisions && (
          <Tab tabID="HISTORY" classes={styles}>
            <Flex alignItems="center" itemGutter>
              <Icon size="md">edit</Icon>
              <Localized id="moderateCardDetails-tab-edits">
                <span>Edit history</span>
              </Localized>
            </Flex>
          </Tab>
        )}
        {hasAutomatedActions && (
          <Tab tabID="EXTERNAL_MOD" classes={styles}>
            <Flex alignItems="center" itemGutter>
              <Icon size="md">done_all</Icon>
              <Localized id="moderateCardDetails-tab-automatedActions">
                <span>Automated actions</span>
              </Localized>
            </Flex>
          </Tab>
        )}
      </TabBar>
      {activeTab === "INFO" && (
        <>
          <LinkDetailsContainer comment={comment} settings={settings} />
          {doesHaveFlagDetails && (
            <FlagDetailsContainer
              comment={comment}
              onUsernameClick={onUsernameClick}
            />
          )}
        </>
      )}
      {activeTab === "REACTIONS" && (
        <ReactionDetailsQuery
          commentID={comment.id}
          onUsernameClick={onUsernameClick}
        />
      )}
      {activeTab === "HISTORY" && (
        <CommentRevisionContainer comment={comment} />
      )}
      {activeTab === "EXTERNAL_MOD" && (
        <AutomatedActionsContainer comment={comment} settings={settings} />
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerateCardDetailsContainer_comment on Comment {
      id
      status
      tags {
        code
      }
      editing {
        edited
      }
      revision {
        actionCounts {
          flag {
            reasons {
              COMMENT_REPORTED_OFFENSIVE
              COMMENT_REPORTED_ABUSIVE
              COMMENT_REPORTED_SPAM
              COMMENT_REPORTED_OTHER
              COMMENT_DETECTED_TOXIC
              COMMENT_DETECTED_SPAM
              COMMENT_REPORTED_BIO
            }
          }
          reaction {
            total
          }
        }
        metadata {
          perspective {
            score
          }
          externalModeration {
            name
            result {
              status
              tags
              actions {
                reason
              }
            }
          }
        }
      }
      ...FlagDetailsContainer_comment
      ...CommentRevisionContainer_comment
      ...LinkDetailsContainer_comment
      ...AutomatedActionsContainer_comment
    }
  `,
  settings: graphql`
    fragment ModerateCardDetailsContainer_settings on Settings {
      ...LinkDetailsContainer_settings
      ...AutomatedActionsContainer_settings
    }
  `,
})(ModerateCardDetailsContainer);

export default enhanced;
