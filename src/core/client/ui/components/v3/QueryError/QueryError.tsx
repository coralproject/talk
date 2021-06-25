import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import TraceableError from "coral-framework/lib/errors/traceableError";

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
    const traceID = error instanceof TraceableError ? error.traceID : "";

    if (traceID) {
      return render(traceID, error.message);
    } else {
      return <div>{error.message}</div>;
    }
  } catch {
    return <div>{error.message}</div>;
  }
};

export default QueryError;
