import { AppOptions } from "coral-server/app";
import Joi from "joi";
import { JSDOM } from "jsdom";
import nunjucks from "nunjucks";

import {
  getCommentEmbedCreatedAtFormatter,
  getCommentEmbedCSS,
  getCommentEmbedData,
  transform,
  transformSimpleEmbed,
} from "coral-server/app/helpers/commentEmbedHelpers";
import { validate } from "coral-server/app/request/body";
import {
  retrieveComment,
  updateCommentEmbeddedAt,
} from "coral-server/models/comment";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const OEmbedServiceQuerySchema = Joi.object().keys({
  url: Joi.string().uri().required(),
  allowReplies: Joi.string().optional(),
  format: Joi.string().optional(),
});

type Options = Pick<AppOptions, "config" | "mongo">;

export const oembedProviderHandler = ({
  config,
  mongo,
}: Options): RequestHandler<TenantCoralRequest> => {
  // TODO: add some kind of rate limiting or spam protection
  return async (req, res, next) => {
    const { tenant } = req.coral;

    const {
      customFontsCSSURL,
      customCSSURL,
      staticURI,
      streamCSS,
      defaultFontsCSS,
    } = await getCommentEmbedCSS(tenant, { config });

    const formatter = getCommentEmbedCreatedAtFormatter(tenant);

    try {
      const { url, allowReplies, format } = validate(
        OEmbedServiceQuerySchema,
        req.query
      );

      // We don't currently support xml format responses
      if (format && format === "xml") {
        res.sendStatus(501);
        return;
      }

      // default to including reply/go to conversation interactions if no query param provided
      const includeReplies = allowReplies ?? true;

      const urlToParse = new URL(url);
      const commentID = urlToParse.searchParams.get("commentID");
      if (commentID) {
        const comment = await retrieveComment(
          mongo.comments(),
          tenant.id,
          commentID
        );

        if (!comment) {
          res.sendStatus(404);
          return;
        }
        const { commentAuthor, commentRevision, mediaUrl, giphyMedia } =
          await getCommentEmbedData(mongo, comment, tenant.id);

        const formattedCreatedAt = formatter.format(comment.createdAt);

        // update the comment with an embeddedAt timestamp if not already set
        if (!comment.embeddedAt) {
          const now = new Date();
          void updateCommentEmbeddedAt(mongo, tenant.id, commentID, now);
        }

        const sanitized = transform(
          new JSDOM("", {}).window as any,
          commentRevision.body
        );

        const sanitizedSimple = transformSimpleEmbed(
          new JSDOM("", {}).window as any,
          commentRevision.body
        );

        const simpleCommentEmbed = nunjucks.render("simpleCommentEmbed.html", {
          commentID,
          includeReplies,
          commentAuthor,
          sanitizedSimple,
        });

        const html = nunjucks.render("oembedService.html", {
          comment,
          commentAuthor,
          commentRevision,
          formattedCreatedAt,
          mediaUrl,
          includeReplies,
          customCSSURL,
          customFontsCSSURL,
          streamCSS,
          defaultFontsCSS,
          staticURI,
          giphyMedia,
          sanitized,
        });

        // Need to update width, height
        res.json({ html, simpleCommentEmbed, width: 0, height: 0 });
      }
    } catch (err) {
      next(err);
    }
  };
};
