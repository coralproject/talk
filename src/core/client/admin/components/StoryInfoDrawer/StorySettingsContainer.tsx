/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { graphql } from "relay-runtime";
import React, { FunctionComponent, useState, FormEvent } from "react";

import { useMutation } from "coral-framework/lib/relay";

import { StorySettingsContainer_storySettings } from "coral-admin/__generated__/StorySettingsContainer_storySettings.graphql";

// TODO (marcushaddon): should this be relocated?
import UpdateStorySettingsMutation from "./UpdateStorySettingsMutation";

import {
  Button,
  CheckBox,
  Flex,
  Icon,
  Tab,
  TabBar,
  TabContent,
  TabPane
} from "coral-ui/components/v2";
import { withFragmentContainer } from "coral-framework/lib/relay";

import Select from "./Select";

import styles from "./StorySettingsContainer.css";
import { GQLMODERATION_MODE, GQLSTORY_MODE } from "coral-framework/schema";

export interface Props {
  storyID: string;
  settings: StorySettingsContainer_storySettings;
}

const StorySettingsContainer: FunctionComponent<Props> = ({ storyID, settings }) => {
  const [activeTab, setActiveTab] = useState("CONFIGURE_STORY");
  const [submitting, setSubmitting] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [updates, setUpdates] = useState({});
  const [premodLinksEnabled, setPremodLinksEnabled] = useState(settings.premodLinksEnable);
  const [liveEnabled, setLiveEnabled] = useState(settings.live.enabled);
  const [liveConfigurable, setLiveConfigurable] = useState(settings.live.configurable);
  const [moderationMode, setModerationMode] = useState(settings.moderation);
  const [mode, setMode] = useState(settings.mode);

  const updateSettings = useMutation(UpdateStorySettingsMutation);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    // TODO (marcushaddon): figure out how to add experts
    // TODO (marcushaddon): figure out whats changed and submit new values

    const res = await updateSettings({
      id: storyID,
      settings: { ...settings },
    });
    setSubmitting(false);

    console.log(res, 'UPDATE RESULT');
  }

  // TODO (marcushaddon): do we need to handle props not existing yet?
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
          <form onSubmit={onSubmit}>
            <Flex direction="column">

              {/* PREMODLINKSENABLED */}
              <CheckBox
                checked={premodLinksEnabled}
                name="premodLinksEnabled"
                onChange={(e) => {
                  const checked = e.target.checked;
                  setPremodLinksEnabled(checked);
                  if (checked !== settings.premodLinksEnable) {
                    setUpdateCount(updateCount + 1);
                  } else {
                    setUpdateCount(updateCount - 1);
                  }
                }}
              /> Pre Mode Links Enabled

              {/* LIVE ENABLED */}
              <CheckBox
                checked={liveEnabled}
                name="live-enabled"
                onChange={(e) => {
                  const checked = e.target.checked;
                  setLiveEnabled(checked);
                  if (checked != settings.live.enabled) {
                    setUpdateCount(updateCount + 1);
                  } else {
                    setUpdateCount(updateCount - 1);
                  }
                }}
              /> Live Enabled

              {/* LIVE CONFIGURABLE */}
              <CheckBox
                checked={liveConfigurable}
                name="live-configurable"
                onChange={(e) => {
                  const checked = e.target.checked;
                  setLiveConfigurable(checked);
                  if (checked != settings.live.configurable) {
                    setUpdateCount(updateCount + 1);
                  } else {
                    setUpdateCount(updateCount - 1);
                  }
                }}
              /> Live Configurable

              {/* MODERATION MODE */}
              <Select
                id="storySettingsContainer-moderationMode"
                description="A menu for setting the moderation mode for the story"
                options={Object.keys(GQLMODERATION_MODE)}
                selected={settings.moderation} // Double check
                onSelect={(clicked) => {
                  setModerationMode(clicked);
                  if (clicked !== settings.moderation) {
                    setUpdateCount(updateCount + 1);
                  } else {
                    setUpdateCount(updateCount - 1);
                  }
                }}
              />

              {/* STORY MODE */}
              <Select
                id="storySettingsContainer-storyMode"
                description="A menu for setting the story mode of the story"
                options={Object.keys(GQLSTORY_MODE)}
                selected={settings.mode}
                onSelect={(clicked) => {
                  setMode(clicked);
                  if (clicked !== settings.mode) {
                    setUpdateCount(updateCount + 1);
                  } else {
                    setUpdateCount(updateCount - 1);
                  }
                }}
              />

              <Button
                variant="outlined"
                color="regular"
                type="submit"
                disabled={submitting || updateCount === 0}
              >
                Save
              </Button>
            </Flex>
          </form>
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
