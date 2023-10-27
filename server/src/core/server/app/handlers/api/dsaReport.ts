import { AppOptions } from "coral-server/app";
import { retrieveDSAReport } from "coral-server/models/dsaReport";
import { sendReportDownload } from "coral-server/services/dsaReports";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

type AdminDownloadOptions = Pick<AppOptions, "mongo">;

export const reportDownloadHandler = ({
  mongo,
}: AdminDownloadOptions): RequestHandler<TenantCoralRequest> => {
  return async (req, res, next) => {
    const { tenant, now } = req.coral;
    const { reportID } = req.query;

    const report = await retrieveDSAReport(mongo, tenant.id, reportID);

    if (!report) {
      return res.sendStatus(400);
    }

    try {
      await sendReportDownload(res, mongo, tenant, report, now);
    } catch (err) {
      return next(err);
    }
  };
};
