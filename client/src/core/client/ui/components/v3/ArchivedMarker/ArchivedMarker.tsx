import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { ArchiveIcon, SvgIcon } from "coral-ui/components/icons";
import { Marker } from "coral-ui/components/v2";

import styles from "./ArchivedMarker.css";

const ArchivedMarker: FunctionComponent = () => {
  return (
    <Marker color="warning" variant="filled">
      <SvgIcon className={styles.icon} size="xs" Icon={ArchiveIcon} />
      <Localized id="general-archived">
        <span>Archived</span>
      </Localized>
    </Marker>
  );
};

export default ArchivedMarker;
