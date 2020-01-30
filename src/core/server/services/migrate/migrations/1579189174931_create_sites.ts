import { Db } from "mongodb";

import { createSite, getURLOrigins, Site } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { MigrationError } from "../error";

interface OldTenant extends Tenant {
  allowedDomains: string[];
}

export default class extends Migration {
  private async createSite(mongo: Db, tenant: Readonly<OldTenant>) {
    const {
      organization: { name },
      domain,
      allowedDomains,
    } = tenant;

    // Convert a tenant's domains into origins that we will re-use on the site.
    const allowedOrigins = getURLOrigins([...allowedDomains, domain]);

    // Create the new site.
    const site = await createSite(mongo, {
      name,
      tenantID: tenant.id,
      allowedOrigins,
    });

    this.logger.info({ site }, "created site");

    // Add the siteID to all the stories.
    let result = await collections
      .stories(mongo)
      .updateMany({ tenantID: tenant.id }, { $set: { siteID: site.id } });

    this.log(tenant.id).info(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "added siteID to stories"
    );

    // Add the siteID to all comments.
    result = await collections
      .comments(mongo)
      .updateMany({ tenantID: tenant.id }, { $set: { siteID: site.id } });

    this.log(tenant.id).info(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "added siteID to comments"
    );

    return site;
  }

  public async up(mongo: Db, tenantID: string) {
    const tenant = await collections
      .tenants<OldTenant>(mongo)
      .findOne({ id: tenantID });
    if (!tenant) {
      throw new MigrationError(tenantID, "could not find tenant", "tenants", [
        tenantID,
      ]);
    }

    // Try to find any site to see if this migration is needed.
    let site = await collections.sites<Site>(mongo).findOne({ tenantID });
    if (site) {
      this.log(tenantID).info({ site }, "site has already been created");
      return;
    }

    // Create the site.
    site = await this.createSite(mongo, tenant);
  }
}
