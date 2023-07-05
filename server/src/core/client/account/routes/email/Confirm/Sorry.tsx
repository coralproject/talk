import { Localized } from "@fluent/react/compat";
import React from "react";

import { CallOut } from "coral-ui/components/v3";

import styles from "./Confirm.css";

interface Props {
  reason: React.ReactNode;
}

const Sorry: React.FunctionComponent<Props> = ({ reason }) => {
  return (
    <div>
      <Localized id="confirmEmail-oopsSorry">
        <div className={styles.title}>Oops Sorry!</div>
      </Localized>
      <CallOut
        color="error"
        titleWeight="semiBold"
        title={
          reason ? (
            reason
          ) : (
            <Localized id="account-tokenNotFound">
              <span data-testid="invalid-link">
                The specified link is invalid, check to see if it was copied
                correctly.
              </span>
            </Localized>
          )
        }
      />
    </div>
  );
};

export default Sorry;
