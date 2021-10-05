/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { Form, Formik, FormikHelpers } from "formik";
import { graphql } from "relay-runtime";
import React, { FunctionComponent, useState } from "react";

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

import { FormikSelect } from "./Select";

import styles from "./StorySettingsContainer.css";
import { GQLMODERATION_MODE, GQLSTORY_MODE } from "coral-framework/schema";

export interface Props {
  storyID: string;
  settings: StorySettingsContainer_storySettings;
}

const StorySettingsContainer: FunctionComponent<Props> = ({ storyID, settings }) => {
  const [activeTab, setActiveTab] = useState("CONFIGURE_STORY");
  const {
    mode,
    moderation: moderationMode,
    premodLinksEnable,
    live: {
      enabled: liveEnabled,
      configurable: liveConfigurable,
    }
  } = settings;

  const updateSettings = useMutation(UpdateStorySettingsMutation);

  const onSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    // TODO (marcushaddon): figure out how to add experts
    // TODO (marcushaddon): should we figure out whats changed and submit only new values?

    const updatedSettings = {
      moderation: values.moderationMode,
      live: {
        enabled: values.liveEnabled,
        configurable: values.liveConfigurable,
      },
      mode: values.mode,
      premodLinksEnable: values.premodLinksEnable,
    }

    const res = await updateSettings({
      id: storyID,
      settings: updatedSettings,
    });
  }

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
          <Formik
            initialValues={{
              mode,
              moderationMode,
              premodLinksEnable,
              liveEnabled,
              liveConfigurable,
            }}
            onSubmit={onSubmit}
          >
            {(args) => {
              return (
                <Form>
                  <Flex direction="column">

                    {/* PREMODLINKSENABLED */}
                    <CheckBox
                      checked={args.values.premodLinksEnable}
                      name="premodLinksEnable"
                      onChange={args.handleChange}
                    /> Pre Mode Links Enabled

                    {/* LIVE ENABLED */}
                    <CheckBox
                      checked={args.values.liveEnabled}
                      name="liveEnabled"
                      onChange={args.handleChange}
                    /> Live Enabled

                    {/* LIVE CONFIGURABLE */}
                    <CheckBox
                      checked={args.values.liveConfigurable}
                      name="liveConfigurable"
                      onChange={args.handleChange}
                    /> Live Configurable

                    {/* MODERATION MODE */}
                    <FormikSelect
                      id="storySettingsContainer-moderationMode"
                      name="moderationMode"
                      description="A menu for setting the moderation mode for the story"
                      options={Object.keys(GQLMODERATION_MODE)}
                      selected={args.values.moderationMode} // Double check
                      onSelect={(selected) => {

                      }}
                    />

                    {/* STORY MODE */}
                    <FormikSelect
                      id="storySettingsContainer-storyMode"
                      name="mode"
                      description="A menu for setting the story mode of the story"
                      options={Object.keys(GQLSTORY_MODE)}
                      selected={settings.mode}
                      onSelect={(clicked) => {
                        // modeHelpers.setValue(clicked);
                      }}
                    />

                    <Button
                      variant="outlined"
                      color="regular"
                      type="submit"
                      disabled={args.isSubmitting}
                    >
                      Save
                    </Button>
                  </Flex>
                </Form>
              );
            }}
          </Formik>
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
