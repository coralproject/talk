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

import CommentRevisionContainer from "./CommentRevisionContainer";
import FlagDetailsContainer from "./FlagDetailsContainer";
import LinkDetailsContainer from "./LinkDetailsContainer";

import styles from "./ModerateCardDetailsContainer.css";

interface Props {
  comment: ModerateCardDetailsContainer_comment;
  settings: ModerateCardDetailsContainer_settings;
  onUsernameClick: (id?: string) => void;
}

type DetailsTabs = "INFO" | "HISTORY";

function hasFlagDetails(c: ModerateCardDetailsContainer_comment) {
  return c.revision
    ? c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_OFFENSIVE +
        c.revision.actionCounts.flag.reasons.COMMENT_REPORTED_ABUSIVE +
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

  const onTabClick = useCallback((id) => setActiveTab(id as DetailsTabs), [
    setActiveTab,
  ]);

  const doesHaveFlagDetails = useMemo(() => hasFlagDetails(comment), [comment]);
  const hasRevisions = comment.editing.edited;

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
        {hasRevisions && (
          <Tab tabID="HISTORY" classes={styles}>
            <Flex alignItems="center" itemGutter>
              <Icon>edit</Icon>
              <Localized id="moderateCardDetails-tab-edits">
                <span>Edit history</span>
              </Localized>
            </Flex>
          </Tab>
        )}
      </TabBar>
      {activeTab === "INFO" && (
        <>
          <LinkDetailsContainer comment={comment} settings={settings} />
          {doesHaveFlagDetails && (
            <>
              <hr />
              <FlagDetailsContainer
                comment={comment}
                settings={settings}
                onUsernameClick={onUsernameClick}
              />
            </>
          )}
        </>
      )}
      {activeTab === "HISTORY" && (
        <CommentRevisionContainer comment={comment} settings={settings} />
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerateCardDetailsContainer_comment on Comment {
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
            }
          }
        }
        metadata {
          perspective {
            score
          }
        }
      }
      ...FlagDetailsContainer_comment
      ...CommentRevisionContainer_comment
      ...LinkDetailsContainer_comment
    }
  `,
  settings: graphql`
    fragment ModerateCardDetailsContainer_settings on Settings {
      ...FlagDetailsContainer_settings
      ...CommentRevisionContainer_settings
      ...LinkDetailsContainer_settings
    }
  `,
})(ModerateCardDetailsContainer);

export default enhanced;
