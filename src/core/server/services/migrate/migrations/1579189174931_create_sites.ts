import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { createCommunity } from "coral-server/models/community";
import { createSite, getUrlOrigins } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import Migration from "coral-server/services/migrate/migration";
import collections from "coral-server/services/mongodb/collections";

// Use the following collections reference to interact with specific
// collections.
import { MigrationError } from "../error";

type OldTenant = Omit<Tenant, "multisite">;

function isOldTenant(tenant: Tenant | OldTenant): tenant is OldTenant {
  if ("multisite" in (tenant as Tenant)) {
    return false;
  }
  return true;
}

export default class extends Migration {
  // Remove the following line once the migration is ready, otherwise the
  // migration will not be ran!
  public static disabled = true;

  public async up(mongo: Db, tenantID: string) {
    const tenant = await collections
      .tenants<Tenant>(mongo)
      .findOne({ id: tenantID });
    if (!tenant) {
      throw new MigrationError(tenantID, "could not find tenant", "tenants", [
        tenantID,
      ]);
    }

    if (!isOldTenant(tenant)) {
      this.log(tenantID).info("tenant already has been migrated");
      return;
    }

    const community = await createCommunity(mongo, {
      tenantID,
      name: tenant.organization.name,
    });

    this.logger.info("created community " + community.id);

    const { name, contactEmail, url } = tenant.organization;

    const allowedDomains = getUrlOrigins([
      ...tenant.allowedDomains,
      tenant.domain,
    ]);

    const site = await createSite(mongo, {
      tenantID,
      communityID: community.id,
      name,
      contactEmail,
      url,
      allowedDomains,
    });

    this.logger.info("created site " + site.id);

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

    await collections.tenants(mongo).updateOne(
      {
        id: tenantID,
      },
      {
        $set: {
          multisite: false,
        },
      }
    );
  }
}
