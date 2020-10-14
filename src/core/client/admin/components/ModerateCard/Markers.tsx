import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { useToggleState, useUUID } from "coral-framework/hooks";
import {
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
} from "coral-ui/components/v2";

import styles from "./Markers.css";

interface Props {
  children: React.ReactNode;
  details: React.ReactElement | null;
}

const Markers: FunctionComponent<Props> = ({ children, details }) => {
  const uuid = useUUID();
  const [showDetails, , toggleDetails] = useToggleState();

  return (
    <HorizontalGutter>
      <Flex itemGutter>
        {children}
        {details && (
          <Button
            variant="text"
            color="mono"
            onClick={toggleDetails}
            aria-controls={uuid}
            aria-expanded={showDetails}
          >
            <Localized id="moderate-markers-details">
              <span className={styles.detailsText}>DETAILS</span>
            </Localized>
            <ButtonIcon>
              {showDetails ? "arrow_drop_up" : "arrow_drop_down"}
            </ButtonIcon>
          </Button>
        )}
      </Flex>
      {showDetails && <div id={uuid}>{details}</div>}
    </HorizontalGutter>
  );
};

export default Markers;
