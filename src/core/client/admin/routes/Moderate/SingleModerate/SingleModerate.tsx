import { Localized } from "@fluent/react/compat";
import { Link } from "found";
import React, { FunctionComponent } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { SubBar } from "coral-ui/components/v2";

import styles from "./SingleModerate.css";

interface Props {
  children?: React.ReactNode;
}

const Moderate: FunctionComponent<Props> = ({ children }) => (
  <div data-testid="single-moderate-container">
    <SubBar className={styles.subBar} gutterBegin gutterEnd>
      <Localized id="moderate-single-goToModerationQueues">
        <Link className={styles.subBarBegin} to="/admin/moderate/">
          Go to moderation queues
        </Link>
      </Localized>
      <Localized id="moderate-single-singleCommentView">
        <div className={styles.subBarTitle}>Single Comment View</div>
      </Localized>
    </SubBar>
    <div className={styles.background} />
    <MainLayout>
      <main className={styles.main}>{children}</main>
    </MainLayout>
  </div>
);

export default Moderate;
