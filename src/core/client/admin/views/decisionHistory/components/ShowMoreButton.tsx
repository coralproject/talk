import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { BaseButton } from "talk-ui/components";

import styles from "./ShowMoreButton.css";

interface Props {
  onClick?: () => void;
}

const ShowMoreButton: StatelessComponent<Props> = props => (
  <Localized id="decisionHistory-showMoreButton">
    <BaseButton className={styles.root} onClick={props.onClick}>
      Show More
    </BaseButton>
  </Localized>
);

export default ShowMoreButton;
