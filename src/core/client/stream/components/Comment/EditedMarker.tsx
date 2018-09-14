import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import styles from "./EditedMarker.css";

const EditedMarker: StatelessComponent = () => (
  <div className={styles.root}>
    (
    <Localized id="comments-editedMarker-edited">
      <span>Edited</span>
    </Localized>
    )
  </div>
);

export default EditedMarker;
