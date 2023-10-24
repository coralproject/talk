import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import ReportRowContainer from "./ReportRowContainer";

interface Props {
  dsaReports: Array<
    { id: string } & PropTypesOf<typeof ReportRowContainer>["dsaReport"]
  >;
}

const ReportsTable: React.FunctionComponent<Props> = ({ dsaReports }) => {
  return (
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
        {/* TODO: Should there be an empty state message */}
        {dsaReports.map((report) => {
          return <ReportRowContainer key={report.id} dsaReport={report} />;
        })}
      </TableBody>
    </Table>
  );
};

export default ReportsTable;
