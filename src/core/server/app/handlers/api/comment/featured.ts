import DataLoader from "dataloader";
import Joi from "joi";
import { compact } from "lodash";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { mapErrorsToNull } from "coral-server/helpers/dataloader";
import {
  getLatestRevision,
  retrieveFeaturedComments,
} from "coral-server/models/comment";
import { retrieveSite } from "coral-server/models/site";
import { retrieveManyStories } from "coral-server/models/story";
import { retrieveManyUsers } from "coral-server/models/user";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const FEATURED_COMMENTS_LIMIT = 5;

export type FeaturedOptions = Pick<AppOptions, "mongo">;

interface FeaturedCommentsQuery {
  callback: string;
  siteID: string;
}

interface FeaturedHandlerResponse {
  comments: Array<{
    id: string;
    body: string;
    createdAt: Date;
    story: {
      id: string;
      url: string | null;
      title: string | null;
      publishedAt: Date | null;
    };
    author: {
      username: string | null;
      id: string | null;
    };
  }>;
}

const FeaturedCommentsSchema = Joi.object().keys({
  callback: Joi.string().required(),
  siteID: Joi.string().required(),
});

export const featuredHander =
  ({ mongo }: FeaturedOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenant } = req.coral;
      // Ensure we have a siteID on the query.
      const { siteID }: FeaturedCommentsQuery = validate(
        FeaturedCommentsSchema,
        req.query
      );

      const site = await retrieveSite(mongo, tenant.id, siteID);
      if (!site) {
        throw new Error("site not found");
      }

      const getStories = new DataLoader((ids: string[]) =>
        retrieveManyStories(mongo, tenant.id, ids)
      );
      const getAuthors = new DataLoader((ids: string[]) =>
        retrieveManyUsers(mongo, tenant.id, ids)
      );

      const comments = await retrieveFeaturedComments(
        mongo,
        tenant.id,
        siteID,
        FEATURED_COMMENTS_LIMIT
      );

      const authorIDs = compact(comments.map((c) => c.authorID));
      const [stories, authors] = await Promise.all([
        getStories
          .loadMany(comments.map((comment) => comment.storyID))
          .then(mapErrorsToNull),
        getAuthors.loadMany(authorIDs).then(mapErrorsToNull),
      ]);

      const response: FeaturedHandlerResponse = {
        comments: comments.map((comment) => {
          const revision = getLatestRevision(comment);
          const story = stories.find(
            (s) => s && !(s instanceof Error) && s.id === comment.storyID
          );
          const author = authors.find((a) => a && a.id === comment.authorID);
          return {
            id: comment.id,
            body: revision.body,
            createdAt: revision.createdAt,
            story: {
              id: comment.storyID,
              title: story?.metadata?.title || null,
              url: story?.url || null,
              publishedAt: story?.metadata?.publishedAt || null,
            },
            author: {
              id: comment.authorID,
              username: author?.username || null,
            },
          };
        }),
      };
      res.jsonp(response);
    } catch (err) {
      return next(err);
    }
  };
