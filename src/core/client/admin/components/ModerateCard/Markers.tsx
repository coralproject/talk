import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { useUUID } from "coral-framework/hooks";
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
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const toggleDetails = useCallback(() => setShowDetails(!showDetails), [
    showDetails,
  ]);
  return (
    <HorizontalGutter>
      <Flex itemGutter>
        {children}
        {details && (
          <Button
            size="small"
            classes={{
              variantDefault: styles.detailsButton,
              colorDefault: styles.detailsButtonColorRegular,
            }}
            variant="ghost"
            onClick={toggleDetails}
            aria-controls={uuid}
            aria-expanded={showDetails}
            color="mono"
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
      {showDetails && (
        <div id={uuid}>
          <hr className={styles.detailsDivider} />
          {details}
        </div>
      )}
    </HorizontalGutter>
  );
};

export default Markers;
