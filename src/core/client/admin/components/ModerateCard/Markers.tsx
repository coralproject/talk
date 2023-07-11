import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { useToggleState, useUUID } from "coral-framework/hooks";
import {
  ArrowsDownIcon,
  ArrowsUpIcon,
  ButtonSvgIcon,
} from "coral-ui/components/icons";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

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
            <ButtonSvgIcon
              size="xxs"
              className={styles.detailsButtonIcon}
              Icon={showDetails ? ArrowsUpIcon : ArrowsDownIcon}
            />
          </Button>
        )}
      </Flex>
      {showDetails && <div id={uuid}>{details}</div>}
    </HorizontalGutter>
  );
};

export default Markers;
