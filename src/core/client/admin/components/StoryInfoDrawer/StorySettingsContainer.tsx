/* eslint-disable */
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { useForm, SubmitHandler, Controller, useController } from "react-hook-form";
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
  Divider,
  Flex,
  Icon,
  Tab,
  TabBar,
  TabContent,
  TabPane
} from "coral-ui/components/v2";
import { withFragmentContainer } from "coral-framework/lib/relay";

import CheckBox from "./Checkbox";
import Select from "./Select";

import styles from "./StorySettingsContainer.css";
import { GQLMODERATION_MODE } from "coral-framework/schema";

export interface Props {
  storyID: string;
  settings: StorySettingsContainer_storySettings;
}

// const Forwarded

const StorySettingsContainer: FunctionComponent<Props> = ({ storyID, settings }) => {
  const [activeTab, setActiveTab] = useState("CONFIGURE_STORY");
  const {
    mode,
    moderation: moderationMode,
    premodLinksEnable,
  } = settings;

  const { register, handleSubmit, watch, formState, control } = useForm<Props["settings"]>();
  console.log(watch());

  const updateSettings = useMutation(UpdateStorySettingsMutation);

  const onSubmit: SubmitHandler<StorySettingsContainer_storySettings> = (data, e) => {
    e?.preventDefault();
    console.log(data, "<- submitted");
    console.log({ formState, dirty: formState.dirtyFields });
  }

  const __onSubmit = async (values: any) => {
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
  }

  const {
    field: { ref: premodLinksEnabledRef, ...premodLinksEnabledProps }
  } = useController<Props["settings"]>({
    name: "premodLinksEnable",
    control,
    defaultValue: premodLinksEnable
  });

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column">
              <Flex direction="row" className={styles.setting}>
                {/* PREMODLINKSENABLED */}
                {/* <Localized id="storyInfoDrawerSettings-premodLinksEnable"> */}
                  <CheckBox
                    name="premodLinksEnable"
                    control={control}
                    defaultValue={premodLinksEnable}
                  >
                    <div className={styles.checkboxText}>Pre Mode Links Enabled</div>
                  </CheckBox>
                {/* </Localized> */}
              </Flex>

              {/* MODERATION MODE */}
              {/* <Flex direction="row" className={styles.setting}>
                <Localized id="storyInfoDrawerSettings-moderation">
                  <Select
                    id="storySettingsContainer-moderationMode"
                    name="moderationMode"
                    label="Moderation"
                    description="A menu for setting the moderation mode for the story"
                    options={Object.keys(GQLMODERATION_MODE)}
                    selected={args.values.moderationMode}
                  />
                </Localized>
              </Flex> */}

              {/* SAVE/SUBMIT */}
              <Button
                variant="outlined"
                color="regular"
                type="submit"
                disabled={formState.isSubmitting|| !formState.dirtyFields}
              >
                Save
              </Button>

              {mode === "QA" && (
                <>
                  <Divider />
                  {/* EXPERT SELECTION */}
                  <ExpertSelectionQuery
                    storyID={storyID}
                  />
                </>
              )}
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
      mode
      moderation
      premodLinksEnable
      experts {
        id
        username
      }
    }
  `
})(StorySettingsContainer);

export default enhanced;
