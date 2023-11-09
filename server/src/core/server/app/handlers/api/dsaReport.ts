import { AppOptions } from "coral-server/app";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { retrieveDSAReport } from "coral-server/models/dsaReport";
import { sendReportDownload } from "coral-server/services/dsaReports";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

type AdminDownloadOptions = Pick<
  AppOptions,
  "mongo" | "i18n" | "redis" | "config"
>;

export const reportDownloadHandler = ({
  mongo,
  i18n,
  redis,
  config,
}: AdminDownloadOptions): RequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    config,
  });
  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

      const { tenant, now } = req.coral;
      const { reportID } = req.query;

      const report = await retrieveDSAReport(mongo, tenant.id, reportID);

      if (!report) {
        return res.sendStatus(400);
      }

      await sendReportDownload(res, mongo, i18n, tenant, report, now);
    } catch (err) {
      return next(err);
    }
  };
};
