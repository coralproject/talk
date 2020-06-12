import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useViewerEvent } from "coral-framework/lib/events";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLUSER_STATUS } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { UserBoxContainer } from "coral-stream/common/UserBox";
import { COMMENTS_ORDER_BY } from "coral-stream/constants";
import {
  SetCommentsOrderByEvent,
  SetCommentsTabEvent,
} from "coral-stream/events";
import {
  Counter,
  Flex,
  HorizontalGutter,
  MatchMedia,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import { StreamContainer_settings as SettingsData } from "coral-stream/__generated__/StreamContainer_settings.graphql";
import { StreamContainer_story as StoryData } from "coral-stream/__generated__/StreamContainer_story.graphql";
import { StreamContainer_viewer as ViewerData } from "coral-stream/__generated__/StreamContainer_viewer.graphql";
import {
  COMMENTS_TAB,
  StreamContainerLocal,
} from "coral-stream/__generated__/StreamContainerLocal.graphql";

import ModerateStreamContainer from "../../../common/ModerateStream/ModerateStreamContainer";
import AllCommentsTab from "./AllCommentsTab";
import AnnouncementContainer from "./Announcement";
import AnsweredComments from "./AnsweredCommentsTab";
import BannedInfo from "./BannedInfo";
import { CommunityGuidelinesContainer } from "./CommunityGuidelines";
import StreamDeletionRequestCalloutContainer from "./DeleteAccount/StreamDeletionRequestCalloutContainer";
import FeaturedComments from "./FeaturedComments";
import FeaturedCommentTooltip from "./FeaturedCommentTooltip";
import { PostCommentFormContainer } from "./PostCommentForm";
import SortMenu from "./SortMenu";
import StoryClosedTimeoutContainer from "./StoryClosedTimeout";
import { SuspendedInfoContainer } from "./SuspendedInfo/index";
import UnansweredCommentsTab from "./UnansweredCommentsTab";
import useCommentCountEvent from "./useCommentCountEvent";

import styles from "./StreamContainer.css";

interface Props {
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
}

interface TooltipTabProps extends Omit<PropTypesOf<typeof Tab>, "ref"> {
  isQA?: boolean;
}

// Use a custom tab for featured comments, because we need to put the tooltip
// button logically next to the tab as both are buttons and position them together
// using absolute positioning.
const TabWithFeaturedTooltip: FunctionComponent<TooltipTabProps> = ({
  isQA,
  ...props
}) => (
  <div className={styles.featuredCommentsTabContainer}>
    <Tab
      {...props}
      classes={{
        root: styles.featureTabRoot,
        secondary: styles.featureTabRoot,
      }}
      className={cn(
        styles.fixedTab,
        CLASSES.tabBarComments.featured,
        styles.featuredCommentsTab,
        { [CLASSES.tabBarComments.activeTab]: props.active }
      )}
      variant="streamSecondary"
    />
    <FeaturedCommentTooltip
      active={props.active}
      isQA={isQA}
      className={cn(
        styles.featuredCommentsInfo,
        CLASSES.tabBarComments.featuredTooltip
      )}
    />
  </div>
);

export const StreamContainer: FunctionComponent<Props> = (props) => {
  const emitSetCommentsTabEvent = useViewerEvent(SetCommentsTabEvent);
  const emitSetCommentsOrderByEvent = useViewerEvent(SetCommentsOrderByEvent);
  const { localStorage } = useCoralContext();
  const [local, setLocal] = useLocal<StreamContainerLocal>(
    graphql`
      fragment StreamContainerLocal on Local {
        siteID
        commentsTab
        commentsOrderBy
      }
    `
  );
  const onChangeOrder = useCallback(
    async (order: React.ChangeEvent<HTMLSelectElement>) => {
      if (local.commentsOrderBy === order.target.value) {
        return;
      }
      setLocal({ commentsOrderBy: order.target.value as any });
      emitSetCommentsOrderByEvent({ orderBy: order.target.value });
      await localStorage.setItem(COMMENTS_ORDER_BY, order.target.value);
    },
    [setLocal, local.commentsOrderBy]
  );
  const onChangeTab = useCallback(
    (tab: COMMENTS_TAB, emit = true) => {
      if (local.commentsTab === tab) {
        return;
      }
      setLocal({ commentsTab: tab });
      if (emit) {
        emitSetCommentsTabEvent({ tab });
      }
    },
    [setLocal, local.commentsTab]
  );
  const banned = Boolean(
    props.viewer && props.viewer.status.current.includes(GQLUSER_STATUS.BANNED)
  );
  const suspended = Boolean(
    props.viewer &&
      props.viewer.status.current.includes(GQLUSER_STATUS.SUSPENDED)
  );

  const allCommentsCount = props.story.commentCounts.totalPublished;
  const featuredCommentsCount = props.story.commentCounts.tags.FEATURED;
  const unansweredCommentsCount = props.story.commentCounts.tags.UNANSWERED;
  const isQA = Boolean(props.story.settings.mode === GQLSTORY_MODE.QA);

  // Emit comment count event.
  useCommentCountEvent(props.story.id, props.story.url, allCommentsCount);

  useEffect(() => {
    // If the comment tab is still in its uninitialized state, "NONE", then we
    // should evaluate that based on the featuredCommentsCount if we should show
    // the featured comments tab first or not.
    if (local.commentsTab === "NONE") {
      // If the selected tab is FEATURED_COMMENTS, but there aren't any featured
      // comments, then switch it to the all comments tab.
      if (featuredCommentsCount === 0) {
        onChangeTab("ALL_COMMENTS", false);
      } else {
        onChangeTab("FEATURED_COMMENTS", false);
      }

      // If we are in Q&A mode, we default to most voted
      // sorting by default
      if (props.story.settings.mode === GQLSTORY_MODE.QA) {
        setLocal({ commentsOrderBy: "REACTION_DESC" });
      }
    }
  }, [local, setLocal, props, featuredCommentsCount, onChangeTab]);

  return (
    <>
      <StoryClosedTimeoutContainer story={props.story} />
      <HorizontalGutter
        className={cn(styles.root, {
          [CLASSES.commentsTabPane.authenticated]: Boolean(props.viewer),
          [CLASSES.commentsTabPane.unauthenticated]: !props.viewer,
        })}
        size="double"
      >
        <Flex alignItems="flex-start" justifyContent="space-between" wrap>
          <UserBoxContainer viewer={props.viewer} settings={props.settings} />
          <div className={styles.moderateStream}>
            <ModerateStreamContainer
              settings={props.settings}
              story={props.story}
              viewer={props.viewer}
            />
          </div>
        </Flex>

        <AnnouncementContainer settings={props.settings} />
        {props.viewer && (
          <StreamDeletionRequestCalloutContainer viewer={props.viewer} />
        )}
        <CommunityGuidelinesContainer settings={props.settings} />
        {!banned && !suspended && (
          <PostCommentFormContainer
            settings={props.settings}
            story={props.story}
            viewer={props.viewer}
            tab={local.commentsTab}
            onChangeTab={onChangeTab}
            commentsOrderBy={local.commentsOrderBy}
          />
        )}
        {banned && <BannedInfo />}
        {suspended && (
          <SuspendedInfoContainer
            viewer={props.viewer}
            settings={props.settings}
          />
        )}
        <HorizontalGutter spacing={4} className={styles.tabBarContainer}>
          <Flex
            direction="row"
            alignItems="flex-end"
            justifyContent="space-between"
            className={styles.tabBarRow}
          >
            <TabBar
              variant="streamSecondary"
              activeTab={local.commentsTab}
              onTabClick={onChangeTab}
              className={cn(CLASSES.tabBarComments.$root, styles.tabBarRoot)}
            >
              {featuredCommentsCount > 0 && (
                <TabWithFeaturedTooltip tabID="FEATURED_COMMENTS" isQA={isQA}>
                  <Flex spacing={1} alignItems="center">
                    {isQA ? (
                      <Localized id="qa-answeredTab">
                        <span>Answered</span>
                      </Localized>
                    ) : (
                      <Localized id="comments-featuredTab">
                        <span>Featured</span>
                      </Localized>
                    )}

                    <Counter
                      data-testid="comments-featuredCount"
                      size="sm"
                      color={
                        local.commentsTab === "FEATURED_COMMENTS"
                          ? "inherit"
                          : "grey"
                      }
                    >
                      <Localized
                        id="comments-counter-shortNum"
                        $count={featuredCommentsCount}
                      >
                        {featuredCommentsCount}
                      </Localized>
                    </Counter>
                  </Flex>
                </TabWithFeaturedTooltip>
              )}
              {isQA && (
                <Tab
                  tabID="UNANSWERED_COMMENTS"
                  className={cn(
                    {
                      [styles.fixedTab]: featuredCommentsCount > 0,
                    },
                    CLASSES.tabBarComments.allComments
                  )}
                  variant="streamSecondary"
                >
                  <Flex alignItems="center" spacing={1}>
                    <Localized id="qa-unansweredTab">
                      <span>Unanswered</span>
                    </Localized>
                    <Counter
                      size="sm"
                      color={
                        local.commentsTab === "UNANSWERED_COMMENTS"
                          ? "inherit"
                          : "grey"
                      }
                    >
                      {unansweredCommentsCount}
                    </Counter>
                  </Flex>
                </Tab>
              )}
              <Tab
                tabID="ALL_COMMENTS"
                className={cn(
                  {
                    [styles.fixedTab]: featuredCommentsCount > 0,
                    [CLASSES.tabBarComments.activeTab]:
                      local.commentsTab === "ALL_COMMENTS",
                  },
                  CLASSES.tabBarComments.allComments
                )}
                variant="streamSecondary"
              >
                <Flex alignItems="center" spacing={1}>
                  {isQA ? (
                    <Localized id="qa-allCommentsTab">
                      <span>All</span>
                    </Localized>
                  ) : (
                    <Localized id="comments-allCommentsTab">
                      <span>All Comments</span>
                    </Localized>
                  )}

                  <Counter
                    size="sm"
                    color={
                      local.commentsTab === "ALL_COMMENTS" ? "inherit" : "grey"
                    }
                  >
                    <Localized
                      id="comments-counter-shortNum"
                      $count={allCommentsCount}
                    >
                      {allCommentsCount}
                    </Localized>
                  </Counter>
                </Flex>
              </Tab>
            </TabBar>
            <MatchMedia ltWidth="sm">
              {(matches) => {
                return !matches ? (
                  <SortMenu
                    className={styles.sortMenu}
                    orderBy={local.commentsOrderBy}
                    onChange={onChangeOrder}
                    reactionSortLabel={props.settings.reaction.sortLabel}
                    showLabel
                    isQA={isQA}
                  />
                ) : null;
              }}
            </MatchMedia>
          </Flex>
          <MatchMedia ltWidth="sm">
            {(matches) => {
              return matches ? (
                <SortMenu
                  className={styles.sortMenu}
                  orderBy={local.commentsOrderBy}
                  onChange={onChangeOrder}
                  reactionSortLabel={props.settings.reaction.sortLabel}
                  fullWidth
                  isQA={isQA}
                />
              ) : null;
            }}
          </MatchMedia>
          <TabContent activeTab={local.commentsTab}>
            {isQA ? (
              <TabPane
                className={CLASSES.featuredCommentsTabPane.$root}
                tabID="FEATURED_COMMENTS"
              >
                <AnsweredComments />
              </TabPane>
            ) : (
              <TabPane
                className={CLASSES.featuredCommentsTabPane.$root}
                tabID="FEATURED_COMMENTS"
              >
                <FeaturedComments />
              </TabPane>
            )}
            {isQA && (
              <TabPane
                className={CLASSES.allCommentsTabPane.$root}
                tabID="UNANSWERED_COMMENTS"
              >
                <UnansweredCommentsTab />
              </TabPane>
            )}
            <TabPane
              className={CLASSES.allCommentsTabPane.$root}
              tabID="ALL_COMMENTS"
            >
              <AllCommentsTab />
            </TabPane>
          </TabContent>
        </HorizontalGutter>
      </HorizontalGutter>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment StreamContainer_story on Story {
      ...PostCommentFormContainer_story
      ...StoryClosedTimeoutContainer_story
      ...CreateCommentReplyMutation_story
      ...CreateCommentMutation_story
      ...ModerateStreamContainer_story
      id
      url
      settings {
        mode
      }
      commentCounts {
        totalPublished
        tags {
          FEATURED
          UNANSWERED
        }
      }
    }
  `,
  viewer: graphql`
    fragment StreamContainer_viewer on User {
      ...UserBoxContainer_viewer
      ...CreateCommentReplyMutation_viewer
      ...CreateCommentMutation_viewer
      ...PostCommentFormContainer_viewer
      ...SuspendedInfoContainer_viewer
      ...StreamDeletionRequestCalloutContainer_viewer
      ...ModerateStreamContainer_viewer
      status {
        current
      }
    }
  `,
  settings: graphql`
    fragment StreamContainer_settings on Settings {
      reaction {
        sortLabel
      }
      ...PostCommentFormContainer_settings
      ...UserBoxContainer_settings
      ...CommunityGuidelinesContainer_settings
      ...SuspendedInfoContainer_settings
      ...AnnouncementContainer_settings
      ...ModerateStreamContainer_settings
    }
  `,
})(StreamContainer);

export default enhanced;
