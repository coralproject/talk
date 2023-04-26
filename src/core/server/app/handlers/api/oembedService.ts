import { AppOptions } from "coral-server/app";
import Joi from "joi";
import nunjucks from "nunjucks";

import { createDateFormatter } from "coral-common/date";
import { createManifestLoader } from "coral-server/app/helpers/manifestLoader";
import { validate } from "coral-server/app/request/body";
import { retrieveComment } from "coral-server/models/comment";
import { retrieveUser } from "coral-server/models/user";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const OEmbedServiceQuerySchema = Joi.object().keys({
  url: Joi.string().uri().required(),
  interactions: Joi.string().optional(),
});

type Options = Pick<AppOptions, "config" | "mongo">;

export const oembedProviderHandler = ({
  config,
  mongo,
}: Options): RequestHandler<TenantCoralRequest> => {
  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    const { tenant } = req.coral;

    const customFontsCSSURL = tenant.customFontsCSSURL;
    const customCSSURL = tenant.customCSSURL;
    const staticURI = config.get("static_uri");

    const manifestLoader = createManifestLoader(config, "asset-manifest.json");

    const streamEntrypointLoader =
      manifestLoader.createEntrypointLoader("stream");
    const entrypoint = await streamEntrypointLoader();
    const streamCSS = entrypoint?.css.filter((css) =>
      css.src.includes("assets/css/stream")
    );
    const defaultFontsCSS = (await manifestLoader.load())[
      "assets/css/typography.css"
    ];

    // Create the date formatter to format the dates for the CSV.
    const formatter = createDateFormatter(tenant.locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    try {
      const { url, interactions } = validate(
        OEmbedServiceQuerySchema,
        req.query
      );

      // default to including reply/go to conversation interactions if no query param provided
      const includeInteractions = interactions ?? true;

      const urlToParse = new URL(url);
      const commentID = urlToParse.searchParams.get("commentID");
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

          // Need to add siteID to media urls
          let mediaUrl = null;
          if (
            commentRevision.media?.type === "twitter" ||
            commentRevision.media?.type === "youtube"
          ) {
            mediaUrl = `/api/oembed?type=${commentRevision.media?.type}&url=${commentRevision.media?.url}`;
          }
          if (commentRevision.media?.type === "external") {
            mediaUrl = `/api/external-media?url=${commentRevision.media.url}`;
          }

          const simpleCommentEmbed = nunjucks.render(
            "simpleCommentEmbed.html",
            {
              commentID,
              commentRevision,
              includeInteractions,
              commentAuthor,
            }
          );

          const html = nunjucks.render("oembedService.html", {
            comment,
            commentAuthor,
            commentRevision,
            formattedCreatedAt,
            mediaUrl,
            includeInteractions,
            customCSSURL,
            customFontsCSSURL,
            streamCSS,
            defaultFontsCSS,
            staticURI,
          });

          // Need to update width, height
          res.json({ html, simpleCommentEmbed, width: 0, height: 0 });
        }
      }
    } catch (err) {
      next(err);
    }
  };
};
