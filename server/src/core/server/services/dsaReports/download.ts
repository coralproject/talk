import archiver from "archiver";
import stringify from "csv-stringify";
import { Response } from "express";

import { createDateFormatter } from "coral-common/common/lib/date";
import { MongoContext } from "coral-server/data/context";
import { DSAReport } from "coral-server/models/dsaReport";
import { Tenant } from "coral-server/models/tenant";

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
  // TODO: Add now to it -${formatter.format(now)}

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
  archive.append(csv, { name: `report-${report.referenceID}-${now}.csv` });

  // TODO: Also localize this
  csv.write(["Reference ID", report.referenceID]);
  csv.write(["Created at", formatter.format(report.createdAt)]);
  // TODO: Retrieve and send through reporter to use and add to CSV
  csv.write(["Law broken", report.lawBrokenDescription]);
  csv.write(["Additional information", report.additionalInformation]);
  // TODO: Retrieve and send through comment data to use and add to CSV
  // TODO: How to add report history?

  csv.end();

  // Mark the end of adding files, no more files can be added after this. Once
  // all the stream readers have finished writing, and have closed, the
  // archiver will close which will finish the HTTP request.
  await archive.finalize();
}
