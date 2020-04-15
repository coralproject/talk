import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { BaseButton } from "coral-ui/components/v2";

import styles from "./ShowMoreButton.css";

interface Props {
  disabled?: boolean;
  onClick?: () => void;
}

const ShowMoreButton: FunctionComponent<Props> = (props) => (
  <Localized id="decisionHistory-showMoreButton">
    <BaseButton
      className={styles.root}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      Show More
    </BaseButton>
  </Localized>
);

export default ShowMoreButton;
