// import { Localized } from "@fluent/react/compat";
import { Option, SelectField } from "coral-ui/components/v2";
import React, { ChangeEvent, EventHandler, FunctionComponent } from "react";

import styles from "./ReportStatusMenu.css";

interface Props {
  onChange: EventHandler<ChangeEvent<HTMLSelectElement>>;
}

const ReportStatusMenu: FunctionComponent<Props> = ({ onChange }) => {
  return (
    <>
      <label
        className={styles.statusLabel}
        htmlFor="coral-reports-report-statusMenu"
      >
        Status
      </label>
      <SelectField id="coral-reports-report-statusMenu" onChange={onChange}>
        {/* <Localized id="comments-sortMenu-newest"> */}
        <Option value="AWAITING_REVIEW">Awaiting review</Option>
        {/* </Localized> */}
        {/* <Localized id="comments-sortMenu-oldest"> */}
        <Option value="UNDER_REVIEW">In review</Option>
        <Option value="COMPLETED">Completed</Option>
        {/* </Localized> */}
      </SelectField>
    </>
  );
};

export default ReportStatusMenu;
