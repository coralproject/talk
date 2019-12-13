import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useState } from "react";
import { graphql } from "react-relay";

import { ModerateCardDetailsContainer_comment as CommentData } from "coral-admin/__generated__/ModerateCardDetailsContainer_comment.graphql";
import { ModerateCardDetailsContainer_settings as SettingsData } from "coral-admin/__generated__/ModerateCardDetailsContainer_settings.graphql";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  Flex,
  HorizontalGutter,
  Icon,
  Tab,
  TabBar,
} from "coral-ui/components/v2";

import CommentRevisionContainer from "./CommentRevisionContainer";
import FlagDetailsContainer from "./FlagDetailsContainer";
import LinkDetailsContainer from "./LinkDetailsContainer";

import styles from "./ModerateCardDetailsContainer.css";

interface Props {
  comment: CommentData;
  settings: SettingsData;
  onUsernameClick: (id?: string) => void;
  hasDetails: boolean;
  hasRevisions: boolean;
}

type DetailsTabs = "DETAILS" | "HISTORY";

const ModerateCardDetailsContainer: FunctionComponent<Props> = ({
  comment,
  onUsernameClick,
  settings,
  hasDetails,
  hasRevisions,
}) => {
  const [activeTab, setActiveTab] = useState<DetailsTabs>(
    hasDetails ? "DETAILS" : "HISTORY"
  );

  return (
    <HorizontalGutter>
      <TabBar
        variant="default"
        activeTab={activeTab}
        onTabClick={id => setActiveTab(id as DetailsTabs)}
      >
        {hasDetails && (
          <Tab tabID="INFO" classes={styles}>
            <Flex alignItems="center" itemGutter>
              <Icon size="md">list</Icon>
              <Localized id="moderateCardDetails-tab-info">
                <span>Info</span>
              </Localized>
            </Flex>
          </Tab>
        )}
        {hasRevisions && (
          <Tab tabID="HISTORY" classes={styles}>
            <Flex alignItems="center" itemGutter>
              <Icon>edit</Icon>
              <Localized id="moderateCardDetails-tab-edits">
                <span>Edit history</span>
              </Localized>
            </Flex>
          </Tab>
        )}
      </TabBar>
      {activeTab === "DETAILS" && (
        <>
          <LinkDetailsContainer comment={comment} settings={settings} />
          <hr />
          <FlagDetailsContainer
            comment={comment}
            settings={settings}
            onUsernameClick={onUsernameClick}
          />
        </>
      )}
      {activeTab === "HISTORY" && (
        <CommentRevisionContainer comment={comment} settings={settings} />
      )}
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment ModerateCardDetailsContainer_comment on Comment {
      ...FlagDetailsContainer_comment
      ...CommentRevisionContainer_comment
      ...LinkDetailsContainer_comment
    }
  `,
  settings: graphql`
    fragment ModerateCardDetailsContainer_settings on Settings {
      ...FlagDetailsContainer_settings
      ...CommentRevisionContainer_settings
      ...LinkDetailsContainer_settings
    }
  `,
})(ModerateCardDetailsContainer);

export default enhanced;
