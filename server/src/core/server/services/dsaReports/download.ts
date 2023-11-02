import archiver from "archiver";
import stringify from "csv-stringify";
import { Response } from "express";

import { createDateFormatter } from "coral-common/common/lib/date";
import { MongoContext } from "coral-server/data/context";
import { retrieveComment } from "coral-server/models/comment";
import { DSAReport } from "coral-server/models/dsaReport";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";

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
  const filename = `coral-dsaReport-${report.referenceID}-${Math.abs(
    now.getTime()
  )}.zip`;

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
  archive.append(csv, {
    name: `report-${report.referenceID}-${Math.abs(now.getTime())}.csv`,
  });

  const reporter = await retrieveUser(mongo, tenant.id, report.userID);

  // TODO: Handle archived comments too
  const reportedComment = await retrieveComment(
    mongo.comments(),
    tenant.id,
    report.commentID
  );
  let reportedCommentAuthorUsername = "";
  if (reportedComment) {
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
  }

  // TODO: Also localize these
  csv.write(["Timestamp", "User", "Action", "Details"]);
  if (reportedComment) {
    csv.write([
      formatter.format(report.createdAt),
      reporter?.username,
      "Report submitted",
      `Reference ID: ${report.referenceID}\nLaw broken: ${report.lawBrokenDescription}\nAdditional info: ${report.additionalInformation}\nComment author: ${reportedCommentAuthorUsername}\nComment body: ${reportedComment.revisions[0].body}\nComment ID: ${reportedComment.id}`,
    ]);
  } else {
    csv.write([
      formatter.format(report.createdAt),
      reporter?.username,
      "Report submitted",
      `Reference ID: ${report.referenceID}\nLaw broken: ${report.lawBrokenDescription}\nAdditional info: ${report.additionalInformation}`,
    ]);
  }

  if (report.history) {
    for (const reportHistoryItem of report.history) {
      const reportCommentAuthor = await retrieveUser(
        mongo,
        tenant.id,
        reportHistoryItem.createdBy
      );
      switch (reportHistoryItem.type) {
        case "STATUS_CHANGED":
          csv.write([
            formatter.format(reportHistoryItem.createdAt),
            reportCommentAuthor?.username,
            "Changed status",
            reportHistoryItem.status,
          ]);
          break;
        case "NOTE":
          csv.write([
            formatter.format(reportHistoryItem.createdAt),
            reportCommentAuthor?.username,
            "Added note",
            reportHistoryItem.body,
          ]);
          break;
        case "DECISION_MADE":
          const details =
            reportHistoryItem.decision?.legality === "ILLEGAL"
              ? `Legality: Illegal\nLegal grounds: ${reportHistoryItem.decision.legalGrounds}\nExplanation: ${reportHistoryItem.decision.detailedExplanation}`
              : "Legality: Legal";
          csv.write([
            formatter.format(reportHistoryItem.createdAt),
            reportCommentAuthor?.username,
            "Made decision",
            details,
          ]);
          break;
        case "SHARE":
          csv.write([
            formatter.format(reportHistoryItem.createdAt),
            reportCommentAuthor?.username,
            "Downloaded report",
            "",
          ]);
          break;
        default:
          csv.write([
            formatter.format(reportHistoryItem.createdAt),
            reportCommentAuthor?.username,
            "",
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
