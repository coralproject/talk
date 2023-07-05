import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";

import { AbsoluteTime } from "coral-ui/components/v2";

import styles from "./SiteDashboardTimestamp.css";

const SiteDashboardHeader: FunctionComponent = () => {
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  useEffect(() => {
    setUpdatedAt(new Date());
  }, []);
  if (!updatedAt) {
    return null;
  }
  return (
    <p className={styles.timestamp}>
      <Localized id="dashboard-heading-last-updated">
        <span>Last updated: </span>
      </Localized>{" "}
      <AbsoluteTime date={updatedAt.toISOString()} />
    </p>
  );
};

export default SiteDashboardHeader;
