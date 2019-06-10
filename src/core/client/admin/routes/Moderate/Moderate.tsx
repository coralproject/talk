import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { PropTypesOf } from "coral-framework/types";
import { SubBar } from "coral-ui/components/SubBar";

import ModerateNavigationContainer from "./ModerateNavigation";
import ModerateSearchBarContainer from "./ModerateSearchBar";

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

const Moderate: FunctionComponent<Props> = ({
  moderationQueues,
  story,
  allStories,
  children,
}) => (
  <div data-testid="moderate-container">
    <ModerateSearchBarContainer story={story} allStories={allStories} />
    <SubBar data-testid="moderate-tabBar-container">
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
