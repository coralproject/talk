import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CallOut from "../CallOut";

import styles from "./QueryError.css";

interface Props {
  error: Error | null;
}

const QueryError: FunctionComponent<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  try {
    const traceIDs = ((error as any).traceIDs as string[]) || [];
    if (traceIDs) {
      const list = traceIDs.join(", ");
      return (
        <CallOut
          color="error"
          title={
            <Localized id="common-error-title">
              <span>An error has occurred</span>
            </Localized>
          }
        >
          <>
            <Localized id="common-error-traceID">
              <div className={styles.heading}>Trace ID</div>
            </Localized>
            <div className={styles.section}>{list}</div>
            <Localized id="common-error-message">
              <div className={styles.heading}>Message</div>
            </Localized>
            <div className={styles.section}>{error.message}</div>
          </>
        </CallOut>
      );
    } else {
      return <div>{error.message}</div>;
    }
  } catch {
    return <div>{error.message}</div>;
  }
};

export default QueryError;
