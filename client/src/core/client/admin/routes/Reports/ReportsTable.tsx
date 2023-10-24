import React from "react";

import AutoLoadMore from "coral-admin/components/AutoLoadMore";
import {
  Flex,
  Spinner,
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
  hasMore: boolean;
  disableLoadMore: boolean;
  onLoadMore: () => void;
  loading: boolean;
}

const ReportsTable: React.FunctionComponent<Props> = ({
  dsaReports,
  hasMore,
  disableLoadMore,
  onLoadMore,
  loading,
}) => {
  return (
    <>
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
      {loading && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {hasMore && (
        <Flex justifyContent="center">
          <AutoLoadMore
            disableLoadMore={disableLoadMore}
            onLoadMore={onLoadMore}
          />
        </Flex>
      )}
    </>
  );
};

export default ReportsTable;
