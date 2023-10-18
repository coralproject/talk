import { useRouter } from "found";
import React, { useCallback } from "react";

import { useDateTimeFormatter } from "coral-framework/hooks";
import { RelativeTime, TableCell, TableRow } from "coral-ui/components/v2";

import { DSAReportStatus } from "coral-admin/__generated__/ReportsContainer_query.graphql";

interface Report {
  readonly id: string;
  readonly createdAt: string;
  readonly publicID: string;
  readonly status: DSAReportStatus | null;
  readonly reporter: {
    readonly username: string | null;
  } | null;
  readonly comment: {
    readonly author: { readonly username: string | null } | null;
  } | null;
  readonly lawBrokenDescription: string;
}

interface Props {
  reports: Report[];
}

// TODO: Make this a container that grabs the Reports info it needs
const ReportsRow: React.FunctionComponent<Props> = ({ reports }) => {
  const formatter = useDateTimeFormatter({
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const { router } = useRouter();

  const onReportRowClick = useCallback(
    (reportID: string) => {
      router.replace(`/admin/reports/report/${reportID}`);
    },
    [router]
  );

  return (
    <>
      {reports.map((report) => {
        return (
          <TableRow
            key={report.publicID}
            onClick={() => onReportRowClick(report.id)}
          >
            <TableCell>{formatter(report.createdAt)}</TableCell>
            <TableCell>
              <RelativeTime date={report.createdAt} />
            </TableCell>
            <TableCell>{report.reporter?.username}</TableCell>
            <TableCell>{report.publicID}</TableCell>
            <TableCell>{report.lawBrokenDescription}</TableCell>
            <TableCell>{report.comment?.author?.username}</TableCell>
            <TableCell>{report.status}</TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default ReportsRow;
