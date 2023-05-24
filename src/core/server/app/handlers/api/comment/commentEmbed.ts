import Joi from "joi";
import { JSDOM } from "jsdom";
import nunjucks from "nunjucks";

import { AppOptions } from "coral-server/app";
import {
  getCommentEmbedCreatedAtFormatter,
  getCommentEmbedCSS,
  getCommentEmbedData,
  transform,
} from "coral-server/app/helpers/commentEmbedHelpers";
import { validate } from "coral-server/app/request/body";
import { constructTenantURL } from "coral-server/app/url";
import {
  retrieveComment,
  updateCommentEmbeddedAt,
} from "coral-server/models/comment";
import { retrieveStory } from "coral-server/models/story";
import { translate } from "coral-server/services/i18n";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export type JSONPEmbedOptions = Pick<AppOptions, "mongo" | "config" | "i18n">;

export interface CommentEmbedJSONPData {
  ref: string;
  html: string;
  defaultFontsCSSURL: string;
  customFontsCSSURL?: string;
  commentID: string;
  tenantURL: string;
}

const CommentEmbedJSONPQuerySchema = Joi.object().keys({
  // Required for JSONP support.
  callback: Joi.string().allow("").optional(),
  commentID: Joi.string().required(),
  allowReplies: Joi.string().optional(),
  reactionLabel: Joi.string().optional(),
  ref: Joi.string().required(),
});

interface CommentEmbedJSONPQuery {
  callback: string;
  commentID: string;
  ref: string;
  allowReplies?: string;
  reactionLabel?: string;
}

/**
 * commentEmbedJSONPHandler returns html for a single comment embed using JSONP.
 */
export const commentEmbedJSONPHandler =
  ({
    mongo,
    config,
    i18n,
  }: JSONPEmbedOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenant } = req.coral;

      const bundle = i18n.getBundle(tenant.locale);
      const replyMessage = translate(
        bundle,
        "Reply",
        "comments-replyButton-reply"
      );
      const goToConversationMessage = translate(
        bundle,
        "Go to conversation",
        "comments-featured-gotoConversation"
      );

      const {
        commentID,
        ref,
        allowReplies,
        reactionLabel,
      }: CommentEmbedJSONPQuery = validate(
        CommentEmbedJSONPQuerySchema,
        req.query
      );

      const {
        customFontsCSSURL,
        customCSSURL,
        staticURI,
        streamCSS,
        defaultFontsCSS: { src: defaultFontsCSSURL },
      } = await getCommentEmbedCSS(tenant, { config });

      const tenantURL = constructTenantURL(config, tenant);

      const formatter = getCommentEmbedCreatedAtFormatter(tenant);

      let html = "";
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

        const story = await retrieveStory(mongo, tenant.id, comment.storyID);
        const commentPermalinkURL = `${story?.url}?commentID=${commentID}`;

        const {
          commentAuthor,
          commentRevision,
          mediaUrl,
          giphyMedia,
          externalMediaUrl,
        } = await getCommentEmbedData(mongo, comment, tenant.id);

        // update the comment with an embeddedAt timestamp if not already set
        if (!comment.embeddedAt) {
          const now = new Date();
          void updateCommentEmbeddedAt(mongo, tenant.id, commentID, now);
        }

        const formattedCreatedAt = formatter.format(comment.createdAt);

        const includeReplies = allowReplies === "true" ?? false;

        const sanitized = transform(
          new JSDOM("", {}).window as any,
          commentRevision.body
        );

        html = nunjucks.render("commentEmbed/singleCommentEmbed.html", {
          comment,
          commentAuthor,
          commentRevision,
          formattedCreatedAt,
          mediaUrl,
          includeReplies,
          streamCSS,
          customCSSURL,
          staticURI: staticURI || tenantURL,
          giphyMedia,
          tenantURL,
          sanitized,
          replyMessage,
          goToConversationMessage,
          reactionLabel,
          externalMediaUrl,
          commentPermalinkURL,
        });
      }

      const data: CommentEmbedJSONPData = {
        ref,
        html,
        customFontsCSSURL,
        defaultFontsCSSURL,
        commentID,
        tenantURL: staticURI || tenantURL,
      };

      // Respond using jsonp.
      res.jsonp(data);
    } catch (err) {
      return next(err);
    }
  };
