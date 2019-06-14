import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";

import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_STATUS } from "coral-framework/schema";
import { StreamContainer_settings as SettingsData } from "coral-stream/__generated__/StreamContainer_settings.graphql";
import { StreamContainer_story as StoryData } from "coral-stream/__generated__/StreamContainer_story.graphql";
import { StreamContainer_viewer as ViewerData } from "coral-stream/__generated__/StreamContainer_viewer.graphql";
import { StreamContainerLocal } from "coral-stream/__generated__/StreamContainerLocal.graphql";
import { UserBoxContainer } from "coral-stream/common/UserBox";
import {
  Counter,
  Flex,
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";
import { PropTypesOf } from "coral-ui/types";

import AllCommentsTab from "./AllCommentsTab";
import BannedInfo from "./BannedInfo";
import { CommunityGuidelinesContainer } from "./CommunityGuidelines";
import FeaturedComments from "./FeaturedComments";
import FeaturedCommentTooltip from "./FeaturedCommentTooltip";
import { PostCommentFormContainer } from "./PostCommentForm";
import SortMenu from "./SortMenu";
import StoryClosedTimeoutContainer from "./StoryClosedTimeout";
import styles from "./StreamContainer.css";

interface Props {
  story: StoryData;
  settings: SettingsData;
  viewer: ViewerData | null;
}

// Use a custom tab for featured comments, because we need to put the tooltip
// button logically next to the tab as both are buttons and position them together
// using absolute positioning.
const FeaturedCommentsTab: FunctionComponent<PropTypesOf<typeof Tab>> = ({
  ...props
}) => (
  <div className={styles.featuredCommentsTabContainer}>
    <Tab {...props} className={styles.featuredCommentsTab}>
      <Flex spacing={1} alignItems="center">
        <Localized id="comments-featuredTab">
          <span>Featured</span>
        </Localized>
      </Flex>
    </Tab>
    <FeaturedCommentTooltip
      active={props.active}
      className={styles.featuredCommentsInfo}
    />
  </div>
);

export const StreamContainer: FunctionComponent<Props> = props => {
  const [local, setLocal] = useLocal<StreamContainerLocal>(
    graphql`
      fragment StreamContainerLocal on Local {
        commentsTab
        commentsOrderBy
      }
    `
  );
  const onChangeOrder = useCallback(
    (order: React.ChangeEvent<HTMLSelectElement>) =>
      setLocal({ commentsOrderBy: order.target.value as any }),
    [setLocal]
  );
  const onChangeTab = useCallback(
    (tab: any) => setLocal({ commentsTab: tab }),
    [setLocal]
  );
  const banned = Boolean(
    props.viewer && props.viewer.status.current.includes(GQLUSER_STATUS.BANNED)
  );
  const AllCommentsCounter = useMemo(
    () => () => (
      <Counter
        size="sm"
        color={local.commentsTab === "ALL_COMMENTS" ? "primary" : "grey"}
      >
        {props.story.commentCounts.totalVisible}
      </Counter>
    ),
    [props.story, local.commentsTab]
  );

  // TODO (cvle): Switch this hack with actual counts :-)
  const hasFeaturedComments = props.story.featuredComments.pageInfo.endCursor;
  return (
    <>
      <StoryClosedTimeoutContainer story={props.story} />
      <HorizontalGutter className={styles.root} size="double">
        <UserBoxContainer viewer={props.viewer} settings={props.settings} />
        <CommunityGuidelinesContainer settings={props.settings} />
        {!banned && (
          <PostCommentFormContainer
            settings={props.settings}
            story={props.story}
          />
        )}
        {banned && <BannedInfo />}
        <HorizontalGutter spacing={5} className={styles.tabBarContainer}>
          <SortMenu
            className={styles.sortMenu}
            orderBy={local.commentsOrderBy}
            onChange={onChangeOrder}
            reactionSortLabel={props.settings.reaction.sortLabel}
          />
          <TabBar
            variant="secondary"
            activeTab={local.commentsTab}
            onTabClick={onChangeTab}
          >
            {hasFeaturedComments && (
              <FeaturedCommentsTab tabID="FEATURED_COMMENTS" />
            )}
            <Tab tabID="ALL_COMMENTS">
              <Localized
                id="comments-allCommentsTab"
                Counter={<AllCommentsCounter />}
              >
                <Flex alignItems="center">
                  All Comments <AllCommentsCounter />
                </Flex>
              </Localized>
            </Tab>
          </TabBar>
          <TabContent activeTab={local.commentsTab}>
            <TabPane tabID="FEATURED_COMMENTS">
              <FeaturedComments />
            </TabPane>
            <TabPane tabID="ALL_COMMENTS">
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
      featuredComments(first: 1) {
        pageInfo {
          endCursor
        }
      }
      commentCounts {
        totalVisible
      }
    }
  `,
  viewer: graphql`
    fragment StreamContainer_viewer on User {
      ...UserBoxContainer_viewer
      ...CreateCommentReplyMutation_viewer
      ...CreateCommentMutation_viewer
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
    }
  `,
})(StreamContainer);

export default enhanced;
