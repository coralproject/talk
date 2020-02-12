import { Db } from "mongodb";

import { dotize } from "coral-common/utils/dotize";
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
} from "coral-server/models/comment";
import {
  createSite,
  getURLOrigins,
  Site,
  updateSiteCounts,
} from "coral-server/models/site";
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

    // Add the siteID to all commentActions.
    result = await collections
      .commentActions(mongo)
      .updateMany({ tenantID: tenant.id }, { $set: { siteID: site.id } });

    this.log(tenant.id).info(
      {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      "added siteID to commentActions"
    );

    return site;
  }

  private async updateStoryActionCommentCounts(mongo: Db, tenant: Tenant) {
    // Create the batch writer.
    const batch = this.batch(collections.stories(mongo), tenant.id);

    // Recalculate the action counts for the stories.
    const cursor = collections
      .commentActions<{
        _id: string;
        actions: {
          actionType: ACTION_TYPE;
          reason?: FLAG_REASON;
          sum: number;
        }[];
      }>(mongo)
      .aggregate([
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

  private async updateCommentCounts(mongo: Db, tenant: Tenant, site: Site) {
    // Create a cursor for going through all the stories. That way we can find
    // all the actions that we can collect in one action.
    const cursor = collections.stories(mongo).find({ tenantID: tenant.id });

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
    }

    // Update the site with the new comment counts.
    await updateSiteCounts(mongo, tenant.id, site.id, counts);
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
    let site = await collections.sites(mongo).findOne({ tenantID });
    if (site) {
      this.log(tenantID).info({ site }, "site has already been created");
      return;
    }

    // Create the site.
    site = await this.createSite(mongo, tenant);

    // Update the story action counts on the stories.
    await this.updateStoryActionCommentCounts(mongo, tenant);

    // Update the site comment counts from the stories.
    await this.updateCommentCounts(mongo, tenant, site);
  }
}
