import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { BaseButton, Button } from "coral-ui/components/v2";

import styles from "./FlagDetailsEntry.css";

interface Props {
  user: React.ReactNode;
  details?: React.ReactNode;
  onClick?: () => void;
  reportID?: React.ReactNode;
}

const FlagDetailsEntry: FunctionComponent<Props> = ({
  user,
  details,
  onClick,
  reportID,
}) => {
  return (
    <div>
      {onClick && (
        <BaseButton className={styles.flagger} onClick={onClick}>
          <span className={styles.user}>{user}</span>
        </BaseButton>
      )}
      {!onClick && <span className={styles.user}>{user}</span>}
      {reportID && (
        <Localized id="moderate-flagDetails-viewDSAReport">
          <Button
            className={styles.viewReportButton}
            color="regular"
            to={`/admin/reports/report/${reportID}`}
            variant="textUnderlined"
          >
            View DSA Report
          </Button>
        </Localized>
      )}
      {details && <span className={styles.details}>{details}</span>}
    </div>
  );
};

export default FlagDetailsEntry;
