/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { graphql } from "relay-runtime";
import React, { FunctionComponent, useState } from "react";

import { StorySettingsContainer_storySettings } from "coral-admin/__generated__/StorySettingsContainer_storySettings.graphql"
import { Flex, Icon, Tab, TabBar, TabContent, TabPane } from "coral-ui/components/v2";
import { withFragmentContainer } from "coral-framework/lib/relay";

import styles from "./StorySettingsContainer.css";

export interface Props {
  storyID: string;
  settings: StorySettingsContainer_storySettings;
}

const StorySettingsContainer: FunctionComponent<Props> = () => {
  const [activeTab, setActiveTab] = useState("CONFIGURE_STORY");

  return (
    <>
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
          <Flex direction="column">

          </Flex>
        </TabPane>
      </TabContent>
    </>
  );
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment StorySettingsContainer_storySettings on StorySettings {
      live {
        enabled
        configurable
      }
      moderation
      premodLinksEnable
      mode
      experts {
        id
        username
      }
    }
  `
})(StorySettingsContainer);

export default enhanced;
