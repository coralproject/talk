import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useState } from "react";
import { Field, Form } from "react-final-form";
import { graphql } from "relay-runtime";

import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import ExpertSelectionQuery from "coral-stream/tabs/Configure/Q&A/ExpertSelectionQuery";
import {
  CheckBox,
  Divider,
  Flex,
  Icon,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components/v2";

import { Button } from "coral-ui/components/v3";

import { StorySettingsContainer_storySettings } from "coral-admin/__generated__/StorySettingsContainer_storySettings.graphql";

import UpdateStorySettingsMutation from "./UpdateStorySettingsMutation";

import styles from "./StorySettingsContainer.css";

export type MODERATION_MODE = StorySettingsContainer_storySettings["moderation"];

export interface Props {
  storyID: string;
  settings: StorySettingsContainer_storySettings;
}

const StorySettingsContainer: FunctionComponent<Props> = ({
  storyID,
  settings: initialSettings,
}) => {
  const [activeTab, setActiveTab] = useState("CONFIGURE_STORY");
  const [settings, setSettings] = useState(initialSettings);

  const { mode, moderation, premodLinksEnable } = settings;

  const updateSettings = useMutation(UpdateStorySettingsMutation);

  const onSubmit = async (
    values: Partial<StorySettingsContainer_storySettings> & {
      premoderateComments?: boolean;
    }
  ) => {
    const updatedSettings = { ...values };

    if (typeof values.premoderateComments === "boolean") {
      updatedSettings.moderation = values.premoderateComments ? "PRE" : "POST";
      delete updatedSettings.premoderateComments;
    }
    const res = await updateSettings({
      id: storyID,
      settings: updatedSettings,
    });

    setSettings(res.story.settings);
  };

  return (
    <>
      <TabBar activeTab="CONFIGURE_STORY" className={styles.tabBar}>
        <Tab active={true} tabID="CONFIGURE_STORY" onTabClick={setActiveTab}>
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
          <Form onSubmit={onSubmit}>
            {({
              handleSubmit,
              submitting,
              dirty,
              submitSucceeded,
              dirtySinceLastSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Flex direction="column">
                    <Flex direction="row" className={styles.setting}>
                      {/* PREMOD ALL COMMENTS ENABLED */}
                      <Field
                        name="premoderateComments"
                        type="checkbox"
                        initialValue={moderation === "PRE"}
                      >
                        {({ input }) => (
                          <Localized id="storyInfoDrawerSettings-premodCommentsEnable">
                            <CheckBox
                              {...input}
                              checked={input.checked}
                              disabled={submitting}
                            >
                              <div className={styles.checkboxText}>
                                Pre-moderate all comments
                              </div>
                            </CheckBox>
                          </Localized>
                        )}
                      </Field>
                    </Flex>
                    <Flex direction="row" className={styles.setting}>
                      {/* PREMODLINKSENABLED */}
                      <Field
                        name="premodLinksEnable"
                        type="checkbox"
                        initialValue={premodLinksEnable}
                      >
                        {({ input }) => (
                          <Localized id="storyInfoDrawerSettings-premodLinksEnable">
                            <CheckBox
                              {...input}
                              checked={input.checked}
                              disabled={submitting}
                            >
                              <div className={styles.checkboxText}>
                                Pre-moderate comments containing links
                              </div>
                            </CheckBox>
                          </Localized>
                        )}
                      </Field>
                    </Flex>

                    {/* SAVE/SUBMIT */}
                    <Button
                      className={styles.submit}
                      variant="outlined"
                      color="primary"
                      type="submit"
                      disabled={
                        submitting ||
                        !dirty ||
                        (submitSucceeded && !dirtySinceLastSubmit)
                      }
                    >
                      Save
                    </Button>

                    {mode === "QA" && (
                      <>
                        <Divider />
                        {/* EXPERT SELECTION */}
                        <ExpertSelectionQuery storyID={storyID} />
                      </>
                    )}
                  </Flex>
                </form>
              );
            }}
          </Form>
        </TabPane>
      </TabContent>
    </>
  );
};

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
  `,
})(StorySettingsContainer);

export default enhanced;
