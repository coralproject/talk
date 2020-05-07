import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect, useState } from "react";

import { AbsoluteTime } from "coral-ui/components";
import { HorizontalGutter } from "coral-ui/components/v2";

import styles from "./SiteDashboardHeader.css";

interface Props {
  name: string;
}

const SiteDashboardHeader: FunctionComponent<Props> = ({ name }) => {
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  useEffect(() => {
    setUpdatedAt(new Date());
  }, []);
  return (
    <HorizontalGutter spacing={1}>
      <h2 className={styles.header}>{name}</h2>
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
    </HorizontalGutter>
  );
};

export default SiteDashboardHeader;
