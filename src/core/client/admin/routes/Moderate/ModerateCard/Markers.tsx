import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { useUUID } from "coral-framework/hooks";
import { Button, Flex, HorizontalGutter, Icon } from "coral-ui/components";

import styles from "./Markers.css";

interface Props {
  children: React.ReactNode;
  details: React.ReactElement | null;
}

const Markers: FunctionComponent<Props> = ({ children, details }) => {
  const uuid = useUUID();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const toggleDetails = useCallback(() => setShowDetails(!showDetails), [
    showDetails,
  ]);
  return (
    <HorizontalGutter size="double">
      <Flex>
        <Flex itemGutter>{children}</Flex>
        {details && (
          <Button
            size="small"
            classes={{
              variantRegular: styles.detailsButton,
              colorRegular: styles.detailsButtonColorRegular,
            }}
            onClick={toggleDetails}
            aria-controls={uuid}
            aria-expanded={showDetails}
          >
            <Localized id="moderate-markers-details">
              <span className={styles.detailsText}>DETAILS</span>
            </Localized>
            <Icon>{showDetails ? "arrow_drop_up" : "arrow_drop_down"}</Icon>
          </Button>
        )}
      </Flex>
      {showDetails && <div id={uuid}>{details}</div>}
    </HorizontalGutter>
  );
};

export default Markers;
