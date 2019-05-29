import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import styles from "./EditedMarker.css";

const EditedMarker: FunctionComponent = () => (
  <div className={styles.root}>
    (
    <Localized id="comments-editedMarker-edited">
      <span>Edited</span>
    </Localized>
    )
  </div>
);

export default EditedMarker;
