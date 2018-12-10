import React, { StatelessComponent } from "react";

import MainLayout from "talk-admin/components/MainLayout";
import { Counter, Icon } from "talk-ui/components";
import { Navigation, SubBar } from "talk-ui/components/SubBar";

import styles from "./Moderate.css";
import NavigationLink from "./NavigationLink";

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
      <Navigation>
        <NavigationLink to="/admin/moderate/reported">
          <Icon>flag</Icon>
          <span>Reported</span>
          {reportedCount !== undefined && <Counter>{reportedCount}</Counter>}
        </NavigationLink>
        <NavigationLink to="/admin/moderate/pending">
          <Icon>access_time</Icon>
          <span>Pending</span>
          {pendingCount !== undefined && <Counter>{pendingCount}</Counter>}
        </NavigationLink>
        <NavigationLink to="/admin/moderate/unmoderated">
          <Icon>forum</Icon>
          <span>Unmoderated</span>
          {unmoderatedCount !== undefined && (
            <Counter>{unmoderatedCount}</Counter>
          )}
        </NavigationLink>
        <NavigationLink to="/admin/moderate/rejected">
          <Icon>cancel</Icon>
          <span>Rejected</span>
        </NavigationLink>
      </Navigation>
    </SubBar>
    <div className={styles.background} />
    <MainLayout>
      <main className={styles.main}>{children}</main>
    </MainLayout>
  </>
);

export default Moderate;
