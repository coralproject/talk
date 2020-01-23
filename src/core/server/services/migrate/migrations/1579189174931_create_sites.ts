import { Db } from "mongodb";

import { createSite, getUrlOrigins, Site } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

import { MigrationError } from "../error";

interface OldTenant extends Tenant {
  allowedDomains: string[];
}

export default class extends Migration {
  public async up(mongo: Db, tenantID: string) {
    const tenant = await collections
      .tenants<OldTenant>(mongo)
      .findOne({ id: tenantID });
    if (!tenant) {
      throw new MigrationError(tenantID, "could not find tenant", "tenants", [
        tenantID,
      ]);
    }

    const existingSite = await collections
      .sites<Site>(mongo)
      .findOne({ tenantID });

    if (existingSite) {
      this.log(tenantID).info("tenant already has been migrated");
      return;
    }

    const { name, contactEmail, url } = tenant.organization;

    const allowedDomains = getUrlOrigins([
      ...tenant.allowedDomains,
      tenant.domain,
    ]);

    const site = await createSite(mongo, {
      tenantID,
      name,
      contactEmail,
      url,
      allowedDomains,
    });

    this.logger.info("created site", { site });

    const storiesResult = await collections.stories(mongo).updateMany(
      {
        tenantID,
      },
      {
        $set: {
          siteID: site.id,
        },
      }
    );

    this.log(tenantID).warn(
      {
        matchedCount: storiesResult.matchedCount,
        modifiedCount: storiesResult.modifiedCount,
      },
      "added siteID to stories"
    );

    const commentsResult = await collections.comments(mongo).updateMany(
      {
        tenantID,
      },
      {
        $set: {
          siteID: site.id,
        },
      }
    );

    this.log(tenantID).warn(
      {
        matchedCount: commentsResult.matchedCount,
        modifiedCount: commentsResult.modifiedCount,
      },
      "added siteID to comments"
    );
  }
}
