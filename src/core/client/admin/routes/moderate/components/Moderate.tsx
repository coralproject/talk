import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import { SubBar } from "talk-ui/components/SubBar";

import styles from "./Moderate.css";
import Navigation from "./Navigation";

interface Props {
  unmoderatedCount?: number;
  reportedCount?: number;
  pendingCount?: number;
  children?: React.ReactNode;
}

const Moderate: StatelessComponent<Props> = ({
  unmoderatedCount,
  reportedCount,
  pendingCount,
  children,
}) => (
  <div data-test="moderate-container">
    <SubBar data-test="moderate-subBar-container">
      <Navigation
        unmoderatedCount={unmoderatedCount}
        reportedCount={reportedCount}
        pendingCount={pendingCount}
      />
    </SubBar>
    <div className={styles.background} />
    <MainLayout data-test="moderate-main-container">
      <main className={styles.main}>{children}</main>
    </MainLayout>
  </div>
);

export default Moderate;
