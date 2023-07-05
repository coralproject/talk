import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import TraceableError from "coral-framework/lib/errors/traceableError";

import CallOut from "../CallOut";

import styles from "./QueryError.css";

interface Props {
  error: Error | null;
}

const QueryError: FunctionComponent<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  const traceID = error instanceof TraceableError ? error.traceID : "";
  return (
    <CallOut
      color="error"
      title={
        <Localized id="common-error-title">
          <span>An error has occurred</span>
        </Localized>
      }
    >
      {traceID && (
        <>
          <Localized id="common-error-traceID">
            <div className={styles.heading}>Trace ID</div>
          </Localized>
          <div className={styles.section}>{traceID}</div>
        </>
      )}
      <Localized id="common-error-message">
        <div className={styles.heading}>Message</div>
      </Localized>
      <div className={styles.section} aria-live={"polite"}>
        {error.message}
      </div>
    </CallOut>
  );
};

export default QueryError;
