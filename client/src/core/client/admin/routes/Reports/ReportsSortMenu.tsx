import { Localized } from "@fluent/react/compat";
import { Flex, Option, SelectField } from "coral-ui/components/v2";
import React, { FunctionComponent } from "react";

import styles from "./ReportsSortMenu.css";

interface Props {
  onChange: (value: string) => void;
}

const ReportsSortMenu: FunctionComponent<Props> = ({ onChange }) => {
  const label = (
    <Localized id="reports-sortMenu-sortBy">
      <label className={styles.sortLabel} htmlFor="coral-reports-sortMenu">
        Sort by
      </label>
    </Localized>
  );
  return (
    <Flex
      paddingBottom={2}
      justifyContent="flex-end"
      alignItems="center"
      itemGutter
    >
      {label}
      <SelectField
        id="coral-reports-sortMenu"
        onChange={(e) => onChange(e.target.value)}
      >
        <Localized id="reports-sortMenu-newest">
          <Option value="CREATED_AT_DESC">Newest</Option>
        </Localized>
        <Localized id="reports-sortMenu-oldest">
          <Option value="CREATED_AT_ASC">Oldest</Option>
        </Localized>
      </SelectField>
    </Flex>
  );
};

export default ReportsSortMenu;
