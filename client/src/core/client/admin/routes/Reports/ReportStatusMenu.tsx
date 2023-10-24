import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Option, SelectField } from "coral-ui/components/v2";

import { DSAReportStatus } from "coral-admin/__generated__/SingleReportRouteQuery.graphql";

import styles from "./ReportStatusMenu.css";

interface Props {
  onChange: (status: string) => Promise<void>;
  value: DSAReportStatus | null;
}

const ReportStatusMenu: FunctionComponent<Props> = ({ onChange, value }) => {
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
        onChange={(e) => onChange(e.target.value)}
        value={value ?? "AWAITING_REVIEW"}
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
      </SelectField>
    </>
  );
};

export default ReportStatusMenu;
