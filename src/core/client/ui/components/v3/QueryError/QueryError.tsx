import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CallOut from "../CallOut";

import styles from "./QueryError.css";

interface Props {
  error: Error | null;
}

const render = (traceID: string, message: string) => {
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
        <div className={styles.section}>{traceID}</div>
        <Localized id="common-error-message">
          <div className={styles.heading}>Message</div>
        </Localized>
        <div className={styles.section}>{message}</div>
      </>
    </CallOut>
  );
};

const QueryError: FunctionComponent<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  try {
    const rawError = error as any;
    const traceIDs = rawError.traceIDs as string[];
    const traceID = rawError.traceID as string;

    if (traceIDs && traceIDs.length > 0) {
      return render(traceIDs.join(", "), error.message);
    } else if (traceID) {
      return render(traceID, error.message);
    } else {
      return <div>{error.message}</div>;
    }
  } catch {
    return <div>{error.message}</div>;
  }
};

export default QueryError;
