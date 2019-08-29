import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import styles from "./EditedMarker.css";

interface Props {
  className?: string;
}

const EditedMarker: FunctionComponent<Props> = props => (
  <div className={cn(styles.root, props.className)}>
    (
    <Localized id="comments-editedMarker-edited">
      <span>Edited</span>
    </Localized>
    )
  </div>
);

export default EditedMarker;
