import React, { useCallback, useState } from "react";

import MainLayout from "coral-admin/components/MainLayout";
import { GQLREPORT_SORT } from "coral-framework/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";

import styles from "./Reports.css";

import ReportsRowQuery from "./ReportsRowQuery";
import ReportsSortMenu from "./ReportsSortMenu";

const Reports: React.FunctionComponent = () => {
  const [orderBy, setOrderBy] = useState<GQLREPORT_SORT>(
    GQLREPORT_SORT.CREATED_AT_DESC
  );

  const onSortChange = useCallback(
    (value: GQLREPORT_SORT) => {
      setOrderBy(value);
    },
    [setOrderBy]
  );

  return (
    <MainLayout className={styles.root}>
      <ReportsSortMenu onChange={onSortChange} />
      <Table fullWidth>
        <TableHead>
          {/* TODO: Need to localize all of these tableheads */}
          <TableRow>
            <TableCell>Report date</TableCell>
            <TableCell>Report age</TableCell>
            <TableCell>Reporter</TableCell>
            <TableCell>Report number</TableCell>
            <TableCell>Law broken</TableCell>
            <TableCell>Comment author</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <ReportsRowQuery orderBy={orderBy} />
        </TableBody>
      </Table>
    </MainLayout>
  );
};

export default Reports;
