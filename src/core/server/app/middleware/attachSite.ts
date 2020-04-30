import { AppOptions } from "coral-server/app";
import {
  countTenantSites,
  retrieveSite,
  retrieveTenantSites,
} from "coral-server/models/site";
import { RequestHandler } from "coral-server/types/express";

export const attachSite = (options: AppOptions): RequestHandler => {
  return async (req, res, next) => {
    const coral = req.coral!;
    const tenant = coral.tenant!;
    const sitesCount = await countTenantSites(options.mongo, tenant.id);
    if (sitesCount > 1) {
      if (req.query.siteID) {
        const site = await retrieveSite(
          options.mongo,
          tenant.id,
          req.query.siteID
        );
        if (site) {
          req.site = site;
          return next();
        }
      }
      return next(
        new Error("Must specify site ID for multisite installations")
      );
    }
    const [site] = await retrieveTenantSites(options.mongo, tenant.id);
    req.site = site;
    return next();
  };
};
