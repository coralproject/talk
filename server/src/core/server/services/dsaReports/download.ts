import archiver from "archiver";
import stringify from "csv-stringify";
import { Response } from "express";

import { createDateFormatter } from "coral-common/common/lib/date";
import { MongoContext } from "coral-server/data/context";
import { DSAReport } from "coral-server/models/dsaReport";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import { retrieveComment } from "coral-server/models/comment";

export async function sendReportDownload(
  res: Response,
  mongo: MongoContext,
  tenant: Tenant,
  report: Readonly<DSAReport>,
  now: Date
) {
  // Create the date formatter to format the dates for the CSV.
  const formatter = createDateFormatter(tenant.locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  // Generate the filename of the file that the user will download.
  const filename = `coral-dsaReport-${report.referenceID}-${now}.zip`;

  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename=${filename}`,
  });

  // Create the zip archive we'll use to write all the exported files to.
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  // Pipe this to the response writer directly.
  archive.pipe(res);

  // Create all the csv writers that'll write the data to the archive.
  const csv = stringify();

  // Add all the streams as files to the archive.
  // TODO: Format now
  archive.append(csv, { name: `report-${report.referenceID}-${now}.csv` });

  const reporter = await retrieveUser(mongo, tenant.id, report.userID);

  // TODO: Also localize this
  csv.write([
    "Reference ID",
    "Created at",
    "Created by",
    "Status",
    "Law broken",
    "Additional information",
    "Decision legality",
    "Decision legal grounds",
    "Decision detailed explanation",
  ]);
  csv.write([
    report.referenceID,
    formatter.format(report.createdAt),
    reporter?.username,
    report.status,
    report.lawBrokenDescription,
    report.additionalInformation,
    report.decision ? report.decision.legality : "",
    report.decision ? report.decision.legalGrounds : "",
    report.decision ? report.decision.detailedExplanation : "",
  ]);

  csv.write([]);

  // TODO: Handle archived comments too
  const reportedComment = await retrieveComment(
    mongo.comments(),
    tenant.id,
    report.commentID
  );
  if (reportedComment) {
    let reportedCommentAuthorUsername = "";
    if (reportedComment.authorID) {
      const reportedCommentAuthor = await retrieveUser(
        mongo,
        tenant.id,
        reportedComment.authorID
      );
      reportedCommentAuthorUsername =
        reportedCommentAuthor && reportedCommentAuthor.username
          ? reportedCommentAuthor.username
          : "";
    }
    csv.write(["Commenter", "Comment", "Comment date"]);
    csv.write([
      reportedCommentAuthorUsername,
      reportedComment.revisions[0].body,
      formatter.format(reportedComment.createdAt),
    ]);
  }

  csv.write([]);
  csv.write(["User", "Update type", "Update info", "Date"]);

  if (report.history) {
    for (let i = 0; i < report.history.length; i++) {
      const reportHistoryItem = report.history[i];
      const reportCommentAuthor = await retrieveUser(
        mongo,
        tenant.id,
        reportHistoryItem.createdBy
      );
      switch (reportHistoryItem.type) {
        case "STATUS_CHANGED":
          csv.write([
            reportCommentAuthor?.username,
            "Changed status",
            reportHistoryItem.status,
            formatter.format(reportHistoryItem.createdAt),
          ]);
          break;
        case "NOTE":
          csv.write([
            reportCommentAuthor?.username,
            "Added note",
            reportHistoryItem.body,
            formatter.format(reportHistoryItem.createdAt),
          ]);
          break;
        case "DECISION_MADE":
          csv.write([
            reportCommentAuthor?.username,
            "Made decision",
            reportHistoryItem.decision?.legality ?? "",
            formatter.format(reportHistoryItem.createdAt),
          ]);
          break;
        case "SHARE":
          csv.write([
            reportCommentAuthor?.username,
            "Downloaded report",
            "",
            formatter.format(reportHistoryItem.createdAt),
          ]);
          break;
        default:
          csv.write([
            reportCommentAuthor?.username,
            "",
            formatter.format(reportHistoryItem.createdAt),
          ]);
      }
    }
  }

  csv.end();

  // Mark the end of adding files, no more files can be added after this. Once
  // all the stream readers have finished writing, and have closed, the
  // archiver will close which will finish the HTTP request.
  await archive.finalize();
}
