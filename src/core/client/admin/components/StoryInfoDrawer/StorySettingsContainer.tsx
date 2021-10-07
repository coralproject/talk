/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { Form, Formik, FormikHelpers } from "formik";
import { graphql } from "relay-runtime";
import React, { FunctionComponent, useState } from "react";

import { useMutation } from "coral-framework/lib/relay";

import { StorySettingsContainer_storySettings } from "coral-admin/__generated__/StorySettingsContainer_storySettings.graphql";
// TODO (marcushaddon): common dir?
import ExpertSelectionQuery from "coral-stream/tabs/Configure/Q&A/ExpertSelectionQuery";

// TODO (marcushaddon): should this be relocated?
import UpdateStorySettingsMutation from "./UpdateStorySettingsMutation";

import {
  Button,
  CheckBox,
  Divider,
  Flex,
  Icon,
  Label,
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
    };

    console.log(updatedSettings);

    helpers.setSubmitting(true);
    const res = await updateSettings({
      id: storyID,
      settings: updatedSettings,
    });
    helpers.setSubmitting(false);
    helpers.setTouched({});
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
            <Localized id="storyInfoDrawer-configure">
              <span>Configure</span>
            </Localized>
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

                    <Flex direction="row" className={styles.setting}>
                      {/* PREMODLINKSENABLED */}
                      <CheckBox
                        checked={args.values.premodLinksEnable}
                        name="premodLinksEnable"
                        onChange={args.handleChange}
                      />
                      <Localized id="storyInfoDrawerSettings-premodLinksEnable">
                        <Label id="storyInfoDrawerSettings-premodLinksEnable">
                          Pre Mode Links Enabled
                        </Label>
                      </Localized>
                    </Flex>

                    <Flex direction="row" className={styles.setting}>
                      {/* LIVE ENABLED */}
                      <CheckBox
                        checked={args.values.liveEnabled}
                        name="liveEnabled"
                        onChange={args.handleChange}
                      />
                      <Localized id="storyInfoDrawerSettings-liveEnabled">
                        <Label id="storyInfoDrawerSettings-liveEnabled">
                          Live Enabled
                        </Label>
                      </Localized>
                    </Flex>

                    <Flex direction="row" className={styles.setting}>
                      {/* LIVE CONFIGURABLE */}
                      <CheckBox
                        checked={args.values.liveConfigurable}
                        name="liveConfigurable"
                        onChange={args.handleChange}
                      />
                      <Localized id="storyInfoDrawerSettings-liveConfigurabel">
                        <Label id="storyInfoDrawerSettings-liveConfigurabel">
                          Live Configurable
                        </Label>
                      </Localized>
                    </Flex>

                    {/* MODERATION MODE */}
                    <Flex direction="row" className={styles.setting}>
                      <Localized id="storyInfoDrawerSettings-moderation">
                        <FormikSelect
                          id="storySettingsContainer-moderationMode"
                          name="moderationMode"
                          label="Moderation"
                          description="A menu for setting the moderation mode for the story"
                          options={Object.keys(GQLMODERATION_MODE)}
                          selected={args.values.moderationMode} // Double check
                          onSelect={(selected) => {

                          }}
                        />
                      </Localized>
                    </Flex>

                    {/* STORY MODE */}
                    <Flex direction="row" className={styles.setting}>
                      <Localized id="storyInfoDrawerSettings-mode">
                        <FormikSelect
                          id="storySettingsContainer-storyMode"
                          name="mode"
                          label="Mode"
                          description="A menu for setting the story mode of the story"
                          options={Object.keys(GQLSTORY_MODE)}
                          selected={settings.mode}
                          onSelect={(clicked) => {
                            // modeHelpers.setValue(clicked);
                          }}
                        />
                      </Localized>
                    </Flex>

                    {/* SAVE/SUBMIT */}
                    <Button
                      variant="outlined"
                      color="regular"
                      type="submit"
                      disabled={args.isSubmitting || !args.dirty}
                    >
                      Save
                    </Button>

                    {args.values.mode === "QA" && (
                      <>
                        <Divider />
                        {/* EXPERT SELECTION */}
                        <ExpertSelectionQuery
                          storyID={storyID}
                        />
                      </>
                    )}
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
