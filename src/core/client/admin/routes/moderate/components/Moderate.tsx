import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import { SubBar } from "talk-ui/components/SubBar";

import Navigation from "./Navigation";

import styles from "./Moderate.css";

interface Props {
  unmoderatedCount?: number;
  reportedCount?: number;
  pendingCount?: number;
  storyID?: string;
  children?: React.ReactNode;
}

const Moderate: StatelessComponent<Props> = ({
  unmoderatedCount,
  reportedCount,
  pendingCount,
  storyID,
  children,
}) => (
  <div data-testid="moderate-container">
    <SubBar data-testid="moderate-subBar-container">
      <Navigation
        unmoderatedCount={unmoderatedCount}
        reportedCount={reportedCount}
        pendingCount={pendingCount}
        storyID={storyID}
      />
    </SubBar>
    <div className={styles.background} />
    <MainLayout data-testid="moderate-main-container">
      <main className={styles.main}>{children}</main>
    </MainLayout>
  </div>
);

export default Moderate;
