import { dotize } from "coral-common/utils/dotize";
import { MongoContext } from "coral-server/data/context";
import {
  ACTION_TYPE,
  encodeActionCountKeys,
  EncodedCommentActionCounts,
  FLAG_REASON,
  mergeCommentActionCounts,
} from "coral-server/models/action/comment";
import {
  createEmptyRelatedCommentCounts,
  mergeCommentModerationQueueCount,
  mergeCommentStatusCount,
  mergeCommentTagCounts,
} from "coral-server/models/comment";
import {
  createSite,
  getURLOrigins,
  retrieveTenantSites,
  Site,
  updateSiteCounts,
} from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import Migration from "coral-server/services/migrate/migration";

import { MigrationError } from "../error";
import { createIndexesFactory } from "../indexing";

interface OldTenant extends Tenant {
  allowedDomains: string[];
}

async function findOrCreateSite(
  mongo: MongoContext,
  tenant: Readonly<OldTenant>
): Promise<Site> {
  // Get all the sites attached to this Tenant (if there are any).
  const sites = await retrieveTenantSites(mongo, tenant.id);
  if (sites && sites.length > 0) {
    // There was at least one site! If there is exactly one, then return it,
    // otherwise there is more than one site.
    if (sites.length === 1) {
      return sites[0];
    }

    // There were more than 1 site! We can't handle this case.
    throw new Error("more than one site for this tenant is available");
  }

  // Convert a tenant's domains into origins that we will re-use on the site.
  const allowedOrigins = getURLOrigins([
    ...tenant.allowedDomains,
    tenant.domain,
  ]);

  return createSite(mongo, {
    tenantID: tenant.id,
    name: tenant.organization.name,
    allowedOrigins,
  });
}

export default class extends Migration {
  private async findOrCreateSite(
    mongo: MongoContext,
    tenant: Readonly<OldTenant>
  ) {
    // Try to find the site.
    const site = await findOrCreateSite(mongo, tenant);

    this.log(tenant.id).info("starting stories migration");

    // Add the siteID to all the stories.
    let result = await mongo
      .stories()
      .updateMany(
        { tenantID: tenant.id, siteID: null },
        { $set: { siteID: site.id } }
      );

    this.log(tenant.id).info(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "finished stories migration"
    );

    this.log(tenant.id).info("starting comments migration");

    // Add the siteID to all comments.
    result = await mongo
      .comments()
      .updateMany(
        { tenantID: tenant.id, siteID: null },
        { $set: { siteID: site.id } }
      );

    this.log(tenant.id).info(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "finished comments migration"
    );

    this.log(tenant.id).info("starting commentActions migration");

    // Add the siteID to all commentActions.
    result = await mongo
      .commentActions()
      .updateMany(
        { tenantID: tenant.id, siteID: null },
        { $set: { siteID: site.id } }
      );

    this.log(tenant.id).info(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "finished commentActions migration"
    );

    return site;
  }

  private async updateStoryActionCommentCounts(
    mongo: MongoContext,
    tenant: Tenant
  ) {
    // Create the batch writer.
    const batch = this.batch(mongo.stories(), tenant.id);

    // Recalculate the action counts for the stories.
    const cursor = mongo.commentActions().aggregate<{
      _id: string;
      actions: {
        actionType: ACTION_TYPE;
        reason?: FLAG_REASON;
        sum: number;
      }[];
    }>([
      // Find all actions related to this Tenant.
      { $match: { tenantID: tenant.id } },
      // Group and count them to collect all the actions related to each
      // action type, reason, and story.
      {
        $group: {
          _id: {
            storyID: "$storyID",
            actionType: "$actionType",
            reason: "$reason",
          },
          sum: { $sum: 1 },
        },
      },
      // Group all the entries from storyID together now, and collect their
      // action summaries.
      {
        $group: {
          _id: "$_id.storyID",
          actions: {
            $push: {
              actionType: "$_id.actionType",
              reason: "$_id.reason",
              sum: "$sum",
            },
          },
        },
      },
    ]);

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (!doc) {
        break;
      }

      // Encode these actions.
      const encodedActionCounts: EncodedCommentActionCounts = {};
      for (const action of doc.actions) {
        for (const key of encodeActionCountKeys(action)) {
          if (key in encodedActionCounts) {
            encodedActionCounts[key] += action.sum;
          } else {
            encodedActionCounts[key] = action.sum;
          }
        }
      }

      // Push the update and process it if we need to.
      await batch.add(
        // Find the story by ID.
        { id: doc._id },
        // Dotize set the action counts on the story.
        { $set: dotize(encodedActionCounts) }
      );
    }

    // Finish the batch.
    await batch.finish();
  }

  private async updateCommentCounts(
    mongo: MongoContext,
    tenant: Tenant,
    site: Site
  ) {
    // Create a cursor for going through all the stories. That way we can find
    // all the actions that we can collect in one action.
    const cursor = mongo.stories().find({ tenantID: tenant.id });

    // Begin accumulating comment counts for the site.
    const counts = createEmptyRelatedCommentCounts();

    // Walk over every story, collecting and aggregating the comment counts.
    while (await cursor.hasNext()) {
      // Grab the story from the cursor.
      const story = await cursor.next();
      if (!story) {
        break;
      }

      // Update the action counts.
      counts.action = mergeCommentActionCounts(
        counts.action,
        story.commentCounts.action
      );

      // Update the status counts.
      counts.status = mergeCommentStatusCount(
        counts.status,
        story.commentCounts.status
      );

      // Update the moderation queue counts.
      counts.moderationQueue = mergeCommentModerationQueueCount(
        counts.moderationQueue,
        story.commentCounts.moderationQueue
      );

      counts.tags = mergeCommentTagCounts(
        counts.tags,
        story.commentCounts.tags
      );
    }

    // Update the site with the new comment counts.
    await updateSiteCounts(mongo, tenant.id, site.id, counts);
  }

  public async up(mongo: MongoContext, tenantID: string) {
    const tenant = await mongo.tenants().findOne<OldTenant>({
      id: tenantID,
    });
    if (!tenant) {
      throw new MigrationError(tenantID, "could not find tenant", "tenants", [
        tenantID,
      ]);
    }

    // Create the site.
    const site = await this.findOrCreateSite(mongo, tenant);

    // Update the story action counts on the stories.
    await this.updateStoryActionCommentCounts(mongo, tenant);

    // Update the site comment counts from the stories.
    await this.updateCommentCounts(mongo, tenant, site);
  }

  public async indexes(mongo: MongoContext) {
    // Create the indexes factory.
    const index = createIndexesFactory(mongo);

    // Add indexes for { tenantID, siteID }.
    await index.comments({ tenantID: 1, siteID: 1 }, { background: true });
    await index.stories({ tenantID: 1, siteID: 1 }, { background: true });
    await index.commentActions(
      { tenantID: 1, siteID: 1 },
      { background: true }
    );
  }
}
