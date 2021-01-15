import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql } from "react-relay";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useViewerEvent } from "coral-framework/lib/events";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import {
  GQLCOMMENT_SORT,
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { UserBoxContainer } from "coral-stream/common/UserBox";
import {
  COMMENTS_ORDER_BY,
  VIEWER_STATUS_CONTAINER_ID,
} from "coral-stream/constants";
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

import { StreamContainer_settings } from "coral-stream/__generated__/StreamContainer_settings.graphql";
import { StreamContainer_story } from "coral-stream/__generated__/StreamContainer_story.graphql";
import { StreamContainer_viewer } from "coral-stream/__generated__/StreamContainer_viewer.graphql";
import {
  COMMENTS_TAB,
  StreamContainerLocal,
} from "coral-stream/__generated__/StreamContainerLocal.graphql";

import ModerateStreamContainer from "../../../common/ModerateStream/ModerateStreamContainer";
import AddACommentButton from "./AddACommentButton";
import AllCommentsTab from "./AllCommentsTab";
import AnnouncementContainer from "./Announcement";
import AnsweredComments from "./AnsweredCommentsTab";
import BannedInfo from "./BannedInfo";
import { CommunityGuidelinesContainer } from "./CommunityGuidelines";
import StreamDeletionRequestCalloutContainer from "./DeleteAccount/StreamDeletionRequestCalloutContainer";
import FeaturedComments from "./FeaturedComments";
import FeaturedCommentTooltip from "./FeaturedCommentTooltip";
import { PostCommentFormContainer } from "./PostCommentForm";
import PreviousCountSpyContainer from "./PreviousCountSpyContainer";
import SortMenu from "./SortMenu";
import StoryClosedTimeoutContainer from "./StoryClosedTimeout";
import { StoryRatingContainer } from "./StoryRating";
import { SuspendedInfoContainer } from "./SuspendedInfo/index";
import UnansweredCommentsTab from "./UnansweredCommentsTab";
import useCommentCountEvent from "./useCommentCountEvent";
import ViewersWatchingContainer from "./ViewersWatchingContainer";
import WarningContainer from "./Warning";

import styles from "./StreamContainer.css";

interface Props {
  story: StreamContainer_story;
  settings: StreamContainer_settings;
  viewer: StreamContainer_viewer | null;
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
    [local.commentsOrderBy, setLocal, emitSetCommentsOrderByEvent, localStorage]
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
    [local.commentsTab, setLocal, emitSetCommentsTabEvent]
  );

  // TODO: extract to separate function
  const banned = !!props.viewer?.status.current.includes(GQLUSER_STATUS.BANNED);
  const suspended = !!props.viewer?.status.current.includes(
    GQLUSER_STATUS.SUSPENDED
  );
  const warned = !!props.viewer?.status.current.includes(GQLUSER_STATUS.WARNED);

  const allCommentsCount = props.story.commentCounts.totalPublished;
  const featuredCommentsCount = props.story.commentCounts.tags.FEATURED;
  const unansweredCommentsCount = props.story.commentCounts.tags.UNANSWERED;

  const isQA = props.story.settings.mode === GQLSTORY_MODE.QA;
  const isRatingsAndReviews =
    props.story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS;

  // The alternate view is only enabled when we have the feature flag, the sort
  // as oldest first, the story is not closed, and comments are not disabled.
  const alternateOldestViewEnabled =
    props.settings.featureFlags.includes(
      GQLFEATURE_FLAG.ALTERNATE_OLDEST_FIRST_VIEW
    ) &&
    local.commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC &&
    (local.commentsTab === "ALL_COMMENTS" ||
      local.commentsTab === "FEATURED_COMMENTS") &&
    !props.story.isClosed &&
    !props.settings.disableCommenting.enabled;

  const showCommentForm =
    // If we aren't banned and...
    !banned &&
    // If we aren't suspended and...
    !suspended &&
    // If we aren't warned.
    !warned;

  // Emit comment count event.
  useCommentCountEvent(props.story.id, props.story.url, allCommentsCount);

  useEffect(() => {
    // If the comment tab is still in its uninitialized state, "NONE", then we
    // should evaluate that based on the featuredCommentsCount if we should show
    // the featured comments tab first or not.
    if (local.commentsTab !== "NONE") {
      return;
    }

    // If the selected tab is FEATURED_COMMENTS, but there aren't any featured
    // comments, then switch it to the all comments tab.
    if (featuredCommentsCount > 0) {
      return onChangeTab("FEATURED_COMMENTS", false);
    }

    if (isRatingsAndReviews) {
      return onChangeTab("REVIEWS", false);
    }

    onChangeTab("ALL_COMMENTS", false);
  }, [
    local,
    setLocal,
    props,
    featuredCommentsCount,
    onChangeTab,
    isRatingsAndReviews,
  ]);

  return (
    <>
      <StoryClosedTimeoutContainer story={props.story} />
      <PreviousCountSpyContainer
        story={props.story}
        settings={props.settings}
      />
      <HorizontalGutter
        className={cn(styles.root, {
          [CLASSES.commentsTabPane.authenticated]: !!props.viewer,
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
        {isRatingsAndReviews && <StoryRatingContainer story={props.story} />}
        {showCommentForm &&
          (alternateOldestViewEnabled ? (
            <AddACommentButton isQA={isQA} />
          ) : (
            <>
              <IntersectionProvider>
                <ViewersWatchingContainer
                  story={props.story}
                  settings={props.settings}
                />
              </IntersectionProvider>
              <PostCommentFormContainer
                settings={props.settings}
                story={props.story}
                viewer={props.viewer}
                tab={local.commentsTab}
                onChangeTab={onChangeTab}
                commentsOrderBy={local.commentsOrderBy}
              />
            </>
          ))}
        {(banned || warned || suspended) && (
          <div id={VIEWER_STATUS_CONTAINER_ID}>
            {banned && <BannedInfo />}
            {suspended && (
              <SuspendedInfoContainer
                viewer={props.viewer}
                settings={props.settings}
              />
            )}
            {warned && <WarningContainer viewer={props.viewer} />}
          </div>
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
                      className={CLASSES.counter}
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
                      className={CLASSES.counter}
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
              {!isRatingsAndReviews && (
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
                      className={CLASSES.counter}
                      color={
                        local.commentsTab === "ALL_COMMENTS"
                          ? "inherit"
                          : "grey"
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
              )}
              {isRatingsAndReviews && (
                <Tab
                  tabID="REVIEWS"
                  className={cn({
                    [styles.fixedTab]: featuredCommentsCount > 0,
                    [CLASSES.tabBarComments.activeTab]:
                      local.commentsTab === "REVIEWS",
                  })}
                  variant="streamSecondary"
                >
                  <Flex alignItems="center" spacing={1}>
                    <Localized id="ratingsAndReviews-reviewsTab">
                      <span>Reviews</span>
                    </Localized>
                    <Counter
                      size="sm"
                      className={CLASSES.counter}
                      color={
                        local.commentsTab === "REVIEWS" ? "inherit" : "grey"
                      }
                    >
                      <Localized
                        id="comments-counter-shortNum"
                        $count={props.story.commentCounts.tags.REVIEW}
                      >
                        {props.story.commentCounts.tags.REVIEW}
                      </Localized>
                    </Counter>
                  </Flex>
                </Tab>
              )}
              {isRatingsAndReviews && (
                <Tab
                  tabID="QUESTIONS"
                  className={cn({
                    [styles.fixedTab]: featuredCommentsCount > 0,
                    [CLASSES.tabBarComments.activeTab]:
                      local.commentsTab === "QUESTIONS",
                  })}
                  variant="streamSecondary"
                >
                  <Flex alignItems="center" spacing={1}>
                    <Localized id="ratingsAndReviews-questionsTab">
                      <span>Questions</span>
                    </Localized>
                    <Counter
                      size="sm"
                      className={CLASSES.counter}
                      color={
                        local.commentsTab === "QUESTIONS" ? "inherit" : "grey"
                      }
                    >
                      <Localized
                        id="comments-counter-shortNum"
                        $count={props.story.commentCounts.tags.QUESTION}
                      >
                        {props.story.commentCounts.tags.QUESTION}
                      </Localized>
                    </Counter>
                  </Flex>
                </Tab>
              )}
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
            <TabPane
              className={CLASSES.featuredCommentsTabPane.$root}
              tabID="FEATURED_COMMENTS"
            >
              {isQA ? <AnsweredComments /> : <FeaturedComments />}
            </TabPane>
            {isQA && (
              <TabPane
                className={CLASSES.allCommentsTabPane.$root}
                tabID="UNANSWERED_COMMENTS"
              >
                <UnansweredCommentsTab />
              </TabPane>
            )}
            {!isRatingsAndReviews && (
              <TabPane
                className={CLASSES.allCommentsTabPane.$root}
                tabID="ALL_COMMENTS"
              >
                <AllCommentsTab />
              </TabPane>
            )}
            {isRatingsAndReviews && (
              <TabPane
                className={CLASSES.allCommentsTabPane.$root}
                tabID="REVIEWS"
              >
                <AllCommentsTab tag={GQLTAG.REVIEW} />
              </TabPane>
            )}
            {isRatingsAndReviews && (
              <TabPane
                className={CLASSES.allCommentsTabPane.$root}
                tabID="QUESTIONS"
              >
                <AllCommentsTab tag={GQLTAG.QUESTION} />
              </TabPane>
            )}
          </TabContent>
        </HorizontalGutter>
      </HorizontalGutter>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment StreamContainer_story on Story {
      id
      url
      isClosed
      settings {
        mode
      }
      commentCounts {
        totalPublished
        tags {
          FEATURED
          UNANSWERED
          REVIEW
          QUESTION
        }
      }
      ...CreateCommentMutation_story
      ...CreateCommentReplyMutation_story
      ...ModerateStreamContainer_story
      ...PostCommentFormContainer_story
      ...PreviousCountSpyContainer_story
      ...StoryClosedTimeoutContainer_story
      ...StoryRatingContainer_story
      ...ViewersWatchingContainer_story
    }
  `,
  viewer: graphql`
    fragment StreamContainer_viewer on User {
      status {
        current
      }
      ...CreateCommentMutation_viewer
      ...CreateCommentReplyMutation_viewer
      ...ModerateStreamContainer_viewer
      ...PostCommentFormContainer_viewer
      ...StreamDeletionRequestCalloutContainer_viewer
      ...SuspendedInfoContainer_viewer
      ...UserBoxContainer_viewer
      ...WarningContainer_viewer
    }
  `,
  settings: graphql`
    fragment StreamContainer_settings on Settings {
      reaction {
        sortLabel
      }
      featureFlags
      disableCommenting {
        enabled
      }
      ...AnnouncementContainer_settings
      ...CommunityGuidelinesContainer_settings
      ...ModerateStreamContainer_settings
      ...PostCommentFormContainer_settings
      ...PreviousCountSpyContainer_settings
      ...SuspendedInfoContainer_settings
      ...UserBoxContainer_settings
      ...ViewersWatchingContainer_settings
    }
  `,
})(StreamContainer);

export default enhanced;
