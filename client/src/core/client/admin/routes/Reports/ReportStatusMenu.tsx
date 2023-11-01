import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { useMutation } from "coral-framework/lib/relay";
import { Option, SelectField } from "coral-ui/components/v2";

import { DSAReportStatus } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./ReportStatusMenu.css";

import ChangeReportStatusMutation from "./ChangeReportStatusMutation";

interface Props {
  value: DSAReportStatus | null;
  reportID: string;
  userID?: string;
  onChangeReportStatusCompleted: () => void;
}

const ReportStatusMenu: FunctionComponent<Props> = ({
  value,
  reportID,
  userID,
  onChangeReportStatusCompleted,
}) => {
  const changeReportStatus = useMutation(ChangeReportStatusMutation);

  const onChangeStatus = useCallback(
    async (status: DSAReportStatus) => {
      if (status === "COMPLETED") {
        onChangeReportStatusCompleted();
      } else {
        if (userID) {
          await changeReportStatus({
            reportID,
            userID,
            status,
          });
        }
      }
    },
    [reportID, userID, changeReportStatus, onChangeReportStatusCompleted]
  );
  return (
    <>
      <label
        className={styles.statusLabel}
        htmlFor="coral-reports-report-statusMenu"
      >
        Status
      </label>
      <SelectField
        id="coral-reports-report-statusMenu"
        onChange={(e) => onChangeStatus(e.target.value as DSAReportStatus)}
        value={value ?? "AWAITING_REVIEW"}
        disabled={value === "COMPLETED" || value === "VOID"}
      >
        <Localized id="reports-reportStatusMenu-awaitingReview">
          <Option value="AWAITING_REVIEW">Awaiting review</Option>
        </Localized>
        <Localized id="reports-reportStatusMenu-inReview">
          <Option value="UNDER_REVIEW">In review</Option>
        </Localized>
        <Localized id="reports-reportStatusMenu-completed">
          <Option value="COMPLETED">Completed</Option>
        </Localized>
        {/* <Localized id="reports-reportStatusMenu-awaitingReview"> */}
        <Option hidden value="VOID">
          Void
        </Option>
        {/* </Localized> */}
      </SelectField>
    </>
  );
};

export default ReportStatusMenu;
