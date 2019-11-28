import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useState } from "react";
import { graphql } from "react-relay";

import { ModerateCardDetailsContainer_comment as CommentData } from "coral-admin/__generated__/ModerateCardDetailsContainer_comment.graphql";
import { ModerateCardDetailsContainer_organization as OrgData } from "coral-admin/__generated__/ModerateCardDetailsContainer_organization.graphql";
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
  organization: OrgData;
  onUsernameClick: (id?: string) => void;
  hasDetails: boolean;
  hasRevisions: boolean;
}

type DetailsTabs = "DETAILS" | "HISTORY";

const ModerateCardDetailsContainer: FunctionComponent<Props> = ({
  comment,
  onUsernameClick,
  hasDetails,
  hasRevisions,
  organization,
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
          <LinkDetailsContainer comment={comment} />
          <hr />
          <FlagDetailsContainer
            comment={comment}
            organization={organization}
            onUsernameClick={onUsernameClick}
          />
        </>
      )}
      {activeTab === "HISTORY" && (
        <CommentRevisionContainer
          comment={comment}
          organization={organization}
        />
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
  organization: graphql`
    fragment ModerateCardDetailsContainer_organization on Organization {
      ...FlagDetailsContainer_organization
      ...CommentRevisionContainer_organization
    }
  `,
})(ModerateCardDetailsContainer);

export default enhanced;
