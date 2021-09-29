import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useState } from "react";

import { GQLSTORY_STATUS } from "coral-framework/schema";
import {
  Flex,
  HorizontalGutter,
  Icon,
  Tab,
  TabBar,
  TabContent,
  TabPane,
  TextLink,
} from "coral-ui/components/v2";

import { StoryInfoDrawerQueryResponse as StoryResponse } from "coral-admin/__generated__/StoryInfoDrawerQuery.graphql";

import RescrapeStory from "./RescrapeStory";
import styles from "./StoryInfoDrawerContainer.css";
import StoryStatus from "./StoryStatus";

export interface Props {
  onClose: () => void;
  story: NonNullable<StoryResponse["story"]>;
}

const MetaDataItem: FunctionComponent<{ result: [string, any] }> = ({
  result: [key, val],
}) => (
  <Flex direction="row" className={styles.metaDataItem}>
    <div>{key}</div>
    <div>{val}</div>
  </Flex>
);

const StoryInfoDrawerContainer: FunctionComponent<Props> = ({
  story,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("CONFIGURE_STORY");
  return (
    <HorizontalGutter spacing={4} className={styles.root}>
      <Flex justifyContent="flex-start">
        <Flex direction="column">
          <Localized id="storyInfoDrawer-title">
            <span className={styles.sectionTitle}>Story Details</span>
          </Localized>
          <h2 className={styles.storyTitle}>
            {story.metadata?.title ? (
              story.metadata.title
            ) : (
              <Localized id="storyInfoDrawer-titleNotAvailable">
                Title not available
              </Localized>
            )}
          </h2>
          <TextLink href={story.url}>{story.url}</TextLink>
          <Flex direction="row" alignItems="center" className={styles.status}>
            <span className={styles.statusText}>Status:</span>
            <StoryStatus
              storyID={story.id}
              currentStatus={story.status as GQLSTORY_STATUS}
            />
          </Flex>
          <Flex direction="column" className={styles.publishInfoSection}>
            <Flex direction="row" className={styles.publishInfo}>
              <Icon className={styles.icon} size="md">
                supervisor_account
              </Icon>
              {story.metadata?.author ? (
                story.metadata.author
              ) : (
                <Localized id="storyInfoDrawer-authorNotAvailable">
                  Author not available
                </Localized>
              )}
            </Flex>
            <Flex direction="row" className={styles.publishInfo}>
              <Icon className={styles.icon} size="md">
                calendar_today
              </Icon>
              {/* TODO (marcushaddon): format */}
              {story.metadata?.publishedAt ? (
                story.metadata.publishedAt
              ) : (
                <Localized id="storyInfoDrawer-publishDateNotAvailable">
                  Publish date not available
                </Localized>
              )}
            </Flex>
          </Flex>
          <Localized id="storyInfoDrawer-scrapedMetaData">
            <span className={styles.sectionTitle}>Scraped Metadata</span>
          </Localized>
          <Flex className={styles.metaData} direction="column">
            {Object.entries(story.metadata as object)
              .filter(([, val]) => typeof val !== "function")
              .map((result, idx) => (
                <MetaDataItem key={idx} result={result} />
              ))}
          </Flex>
          <RescrapeStory storyID={story.id} />
          <TabBar activeTab="CONFIGURE_STORY" className={styles.tabBar}>
            <Tab
              active={true}
              tabID="CONFIGURE_STORY"
              onTabClick={setActiveTab}
            >
              <Flex
                alignItems="center"
                className={cn(styles.tab, {
                  [styles.activeTab]: activeTab === "CONFIGURE_STORY",
                })}
              >
                <Icon size="sm" className={styles.tabIcon}>
                  settings
                </Icon>
                <Localized id="storyInfoDrawer-configure">Configure</Localized>
              </Flex>
            </Tab>
          </TabBar>
          <TabContent activeTab={activeTab}>
            <TabPane tabID="CONFIGURE_STORY" className={styles.configureStory}>
              Addition of any other story specific configuration
            </TabPane>
          </TabContent>
        </Flex>
      </Flex>
    </HorizontalGutter>
  );
};

export default StoryInfoDrawerContainer;
