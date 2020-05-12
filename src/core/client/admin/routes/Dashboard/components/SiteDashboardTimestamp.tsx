import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";

import { AbsoluteTime } from "coral-ui/components";

import styles from "./SiteDashboardTimestamp.css";

const SiteDashboardHeader: FunctionComponent = () => {
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  useEffect(() => {
    setUpdatedAt(new Date());
  }, []);
  return (
    <>
      {updatedAt && (
        <Localized
          id="dashboard-site-updated-at"
          $timestamp={<AbsoluteTime date={updatedAt.toISOString()} />}
        >
          <p className={styles.timestamp}>
            Last updated: <AbsoluteTime date={updatedAt.toISOString()} />
          </p>
        </Localized>
      )}
    </>
  );
};

export default SiteDashboardHeader;
