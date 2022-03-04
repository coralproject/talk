import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { graphql, useFragment } from "react-relay";

import {
  Flex,
  HorizontalGutter,
  Icon,
  Tab,
  TabBar,
} from "coral-ui/components/v2";

import { ModerateCardDetailsContainer_comment$key as ModerateCardDetailsContainer_comment } from "coral-admin/__generated__/ModerateCardDetailsContainer_comment.graphql";
import { ModerateCardDetailsContainer_settings$key as ModerateCardDetailsContainer_settings } from "coral-admin/__generated__/ModerateCardDetailsContainer_settings.graphql";

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

function hasFlagDetails(c: ModerateCardDetailsContainer_comment[" $data"]) {
  return c && c.revision
    ? c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_ABUSIVE +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OTHER +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_SPAM >
        0 || c.revision.metadata.perspective
    : false;
}

const ModerateCardDetailsContainer: FunctionComponent<Props> = ({
  comment,
  onUsernameClick,
  settings,
}) => {
  const commentData = useFragment(
    graphql`
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
    comment
  );
  const settingsData = useFragment(
    graphql`
      fragment ModerateCardDetailsContainer_settings on Settings {
        ...AutomatedActionsContainer_settings
      }
    `,
    settings
  );

  const [activeTab, setActiveTab] = useState<DetailsTabs>("INFO");

  const onTabClick = useCallback((id) => setActiveTab(id as DetailsTabs), [
    setActiveTab,
  ]);

  const doesHaveFlagDetails = useMemo(() => hasFlagDetails(commentData), [
    commentData,
  ]);
  const hasRevisions = commentData.editing.edited;
  const hasAutomatedActions = !!(
    commentData &&
    commentData.revision &&
    commentData.revision.metadata &&
    ((commentData.revision.metadata.perspective &&
      commentData.revision.metadata.perspective.score > 0) ||
      (commentData.revision.metadata.externalModeration &&
        commentData.revision.metadata.externalModeration.length > 0))
  );
  const hasReactions = !!(
    commentData &&
    commentData.revision &&
    commentData.revision.actionCounts.reaction.total > 0
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
          <LinkDetailsContainer comment={commentData} />
          {doesHaveFlagDetails && (
            <FlagDetailsContainer
              comment={commentData}
              onUsernameClick={onUsernameClick}
            />
          )}
        </>
      )}
      {activeTab === "REACTIONS" && (
        <ReactionDetailsQuery
          commentID={commentData.id}
          onUsernameClick={onUsernameClick}
        />
      )}
      {activeTab === "HISTORY" && (
        <CommentRevisionContainer comment={commentData} />
      )}
      {activeTab === "EXTERNAL_MOD" && (
        <AutomatedActionsContainer
          comment={commentData}
          settings={settingsData}
        />
      )}
    </HorizontalGutter>
  );
};

export default ModerateCardDetailsContainer;
