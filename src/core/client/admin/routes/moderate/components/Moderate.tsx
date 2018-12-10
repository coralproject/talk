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
  <>
    <SubBar>
      <Navigation
        unmoderatedCount={unmoderatedCount}
        reportedCount={reportedCount}
        pendingCount={pendingCount}
      />
    </SubBar>
    <div className={styles.background} />
    <MainLayout>
      <main className={styles.main}>{children}</main>
    </MainLayout>
  </>
);

export default Moderate;
