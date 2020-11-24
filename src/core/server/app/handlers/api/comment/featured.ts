import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import {
  Comment,
  getLatestRevision,
  retrieveFeaturedComments,
} from "coral-server/models/comment";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

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
      // url: string
      // title: string | null;
      // publishedAt: Date | null;
    };
    author: {
      // username: string;
      id: string | null;
    };
  }>;
}

const FeaturedCommentsSchema = Joi.object().keys({
  callback: Joi.string().allow("").optional(),
  siteID: Joi.string().required(),
});

export const featuredHander = ({
  mongo,
}: FeaturedOptions): RequestHandler<TenantCoralRequest> => async (
  req,
  res,
  next
) => {
  try {
    const { tenant } = req.coral;
    // Ensure we have a siteID on the query.
    const { siteID }: FeaturedCommentsQuery = validate(
      FeaturedCommentsSchema,
      req.query
    );
    const data = await retrieveFeaturedComments(mongo, tenant.id, siteID, 5);
    const response: FeaturedHandlerResponse = {
      comments: (data as Comment[]).map((comment) => {
        const revision = getLatestRevision(comment);
        return {
          id: comment.id,
          body: revision.body,
          createdAt: revision.createdAt,
          story: {
            id: comment.storyID,
          },
          author: {
            id: comment.authorID,
          },
        };
      }),
    };
    res.jsonp(response);
  } catch (err) {
    return next(err);
  }
};
