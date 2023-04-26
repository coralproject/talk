import Joi from "joi";
import nunjucks from "nunjucks";

import { createDateFormatter } from "coral-common/date";
import { AppOptions } from "coral-server/app";
import { createManifestLoader } from "coral-server/app/helpers/manifestLoader";
import { validate } from "coral-server/app/request/body";
import { constructTenantURL } from "coral-server/app/url";
import { retrieveComment } from "coral-server/models/comment";
import { retrieveUser } from "coral-server/models/user";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export type JSONPEmbedOptions = Pick<AppOptions, "mongo" | "config">;

export interface CommentEmbedJSONPData {
  ref: string;
  html: string;
  defaultFontsCSSURL: string;
  customFontsCSSURL?: string;
}

const CommentEmbedJSONPQuerySchema = Joi.object().keys({
  // Required for JSONP support.
  callback: Joi.string().allow("").optional(),
  commentID: Joi.string().required(),
  interactions: Joi.string().optional(),
  ref: Joi.string().required(),
});

interface CommentEmbedJSONPQuery {
  callback: string;
  commentID: string;
  ref: string;
  interactions?: string;
}

/**
 * commentEmbedJSONPHandler returns html for a single comment embed using JSONP.
 */
export const commentEmbedJSONPHandler =
  ({ mongo, config }: JSONPEmbedOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenant } = req.coral;
      const customFontsCSSURL = tenant.customFontsCSSURL;
      const customCSSURL = tenant.customCSSURL;
      const staticURI = config.get("static_uri");

      const tenantURL = constructTenantURL(config, tenant);

      // Ensure we have something to query with.
      const { commentID, ref, interactions }: CommentEmbedJSONPQuery = validate(
        CommentEmbedJSONPQuerySchema,
        req.query
      );

      const manifestLoader = createManifestLoader(
        config,
        "asset-manifest.json"
      );

      const streamEntrypointLoader =
        manifestLoader.createEntrypointLoader("stream");
      const entrypoint = await streamEntrypointLoader();
      const streamCSS = entrypoint?.css.filter((css) =>
        css.src.includes("assets/css/stream")
      );
      const defaultFontsCSSURL = (await manifestLoader.load())[
        "assets/css/typography.css"
      ].src;

      const formatter = createDateFormatter(tenant.locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      let html = "";
      if (commentID) {
        const comment = await retrieveComment(
          mongo.comments(),
          tenant.id,
          commentID
        );
        if (!comment) {
          // throw 404 Not Found
          throw new Error("Comment not found");
        }

        if (comment.authorID) {
          const commentAuthor = await retrieveUser(
            mongo,
            tenant.id,
            comment.authorID
          );

          if (!commentAuthor) {
            // should we include a fallback for comment author if not found?
          }

          // the latest comment revision
          const commentRevision =
            comment.revisions[comment.revisions.length - 1];

          const formattedCreatedAt = formatter.format(comment.createdAt);

          // KNOTE: Need to add siteID to media urls
          let mediaUrl = null;
          let giphyMedia = null;
          if (
            commentRevision.media?.type === "twitter" ||
            commentRevision.media?.type === "youtube"
          ) {
            mediaUrl = `/api/oembed?type=${commentRevision.media?.type}&url=${commentRevision.media?.url}`;
          }
          if (commentRevision.media?.type === "external") {
            mediaUrl = `/api/external-media?url=${commentRevision.media.url}`;
          }
          if (commentRevision.media?.type === "giphy") {
            giphyMedia = commentRevision.media;
          }

          const includeInteractions = interactions === "true" ?? false;

          html = nunjucks.render("oembedService.html", {
            comment,
            commentAuthor,
            commentRevision,
            formattedCreatedAt,
            mediaUrl,
            includeInteractions,
            streamCSS,
            customCSSURL,
            staticURI,
            giphyMedia,
            tenantURL,
          });
        }
      }

      const data: CommentEmbedJSONPData = {
        ref,
        html,
        customFontsCSSURL,
        defaultFontsCSSURL,
      };

      // Respond using jsonp.
      res.jsonp(data);
    } catch (err) {
      return next(err);
    }
  };
