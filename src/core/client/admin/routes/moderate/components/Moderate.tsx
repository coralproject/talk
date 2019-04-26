import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import { PropTypesOf } from "talk-framework/types";
import { SubBar } from "talk-ui/components/SubBar";

import ModerateNavigationContainer from "../containers/ModerateNavigationContainer";
import ModerateSearchBarContainer from "../containers/ModerateSearchBarContainer";

import styles from "./Moderate.css";

interface Props {
  story: PropTypesOf<typeof ModerateNavigationContainer>["story"] &
    PropTypesOf<typeof ModerateSearchBarContainer>["story"];
  moderationQueues: PropTypesOf<
    typeof ModerateNavigationContainer
  >["moderationQueues"];
  allStories: boolean;
  children?: React.ReactNode;
}

const Moderate: StatelessComponent<Props> = ({
  moderationQueues,
  story,
  allStories,
  children,
}) => (
  <div data-testid="moderate-container">
    <ModerateSearchBarContainer story={story} allStories={allStories} />
    <SubBar data-testid="moderate-subBar-container">
      <ModerateNavigationContainer
        moderationQueues={moderationQueues}
        story={story}
      />
    </SubBar>
    <div className={styles.background} />
    <MainLayout data-testid="moderate-main-container">
      <main className={styles.main}>{children}</main>
    </MainLayout>
  </div>
);

export default Moderate;
