import archiver from "archiver";
import stringify from "csv-stringify";
import { Response } from "express";

import { createDateFormatter } from "coral-common/common/lib/date";
import { MongoContext } from "coral-server/data/context";
import { retrieveComment } from "coral-server/models/comment";
import { DSAReport } from "coral-server/models/dsaReport";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";

import { I18n, translate } from "../i18n";

export async function sendReportDownload(
  res: Response,
  mongo: MongoContext,
  i18n: I18n,
  tenant: Tenant,
  report: Readonly<DSAReport>,
  now: Date
) {
  const bundle = i18n.getBundle(tenant.locale);

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

  let reportedComment = await retrieveComment(
    mongo.comments(),
    tenant.id,
    report.commentID
  );
  if (!reportedComment && mongo.archive) {
    reportedComment = await retrieveComment(
      mongo.archivedComments(),
      tenant.id,
      report.commentID
    );
  }

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

  csv.write([
    translate(bundle, "Timestamp", "dsaReportCSV-timestamp"),
    translate(bundle, "User", "dsaReportCSV-user"),
    translate(bundle, "Action", "dsaReportCSV-action"),
    translate(bundle, "Details", "dsaReportCSV-details"),
  ]);
  if (reportedComment) {
    csv.write([
      formatter.format(report.createdAt),
      reporter?.username,
      translate(bundle, "Report submitted", "dsaReportCSV-reportSubmitted"),
      `${translate(bundle, "Reference ID", "dsaReportCSV-referenceID")}: ${
        report.referenceID
      }\n${translate(bundle, "Legal detail", "dsaReportCSV-legalDetail")}: ${
        report.lawBrokenDescription
      }\n${translate(
        bundle,
        "Additional info",
        "dsaReportCSV-additionalInfo"
      )}: ${report.additionalInformation}\n${translate(
        bundle,
        "Comment author",
        "dsaReportCSV-commentAuthor"
      )}: ${reportedCommentAuthorUsername}\nComment body: ${
        reportedComment.revisions[0].body
      }\n${translate(bundle, "Comment ID", "dsaReportCSV-commentID")}: ${
        reportedComment.id
      }`,
    ]);
  } else {
    csv.write([
      formatter.format(report.createdAt),
      reporter?.username,
      translate(bundle, "Report submitted", "dsaReportCSV-reportSubmitted"),
      `${translate(bundle, "Reference ID", "dsaReportCSV-referenceID")}: ${
        report.referenceID
      }\n${translate(bundle, "Legal detail", "dsaReportCSV-legalDetail")}: ${
        report.lawBrokenDescription
      }\n${translate(
        bundle,
        "Additional info",
        "dsaReportCSV-additionalInfo"
      )}: ${report.additionalInformation}`,
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
            translate(bundle, "Changed status", "dsaReportCSV-changedStatus"),
            reportHistoryItem.status,
          ]);
          break;
        case "NOTE":
          csv.write([
            formatter.format(reportHistoryItem.createdAt),
            reportCommentAuthor?.username,
            translate(bundle, "Added note", "dsaReportCSV-addedNote"),
            reportHistoryItem.body,
          ]);
          break;
        case "DECISION_MADE":
          {
            const details =
              reportHistoryItem.decision?.legality === "ILLEGAL"
                ? `${translate(
                    bundle,
                    "Legality: Illegal",
                    "dsaReportCSV-legality-illegal"
                  )}\n${translate(
                    bundle,
                    "Legal grounds",
                    "dsaReportCSV-legalGrounds"
                  )}: ${reportHistoryItem.decision.legalGrounds}\n${translate(
                    bundle,
                    "Explanation",
                    "dsaReportCSV-explanation"
                  )}: ${reportHistoryItem.decision.detailedExplanation}`
                : `${translate(
                    bundle,
                    "Legality: Legal",
                    "dsaReportCSV-legality-legal"
                  )}`;
            csv.write([
              formatter.format(reportHistoryItem.createdAt),
              reportCommentAuthor?.username,
              translate(bundle, "Made decision", "dsaReportCSV-madeDecision"),
              details,
            ]);
          }
          break;
        case "SHARE":
          csv.write([
            formatter.format(reportHistoryItem.createdAt),
            reportCommentAuthor?.username,
            translate(
              bundle,
              "Downloaded report",
              "dsaReportCSV-downloadedReport"
            ),
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
