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
import { constructTenantURL } from "coral-server/app/url";
import {
  retrieveComment,
  updateCommentEmbeddedAt,
} from "coral-server/models/comment";
import { retrieveStory } from "coral-server/models/story";
import { translate } from "coral-server/services/i18n";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

const OEmbedServiceQuerySchema = Joi.object().keys({
  url: Joi.string().uri().required(),
  allowReplies: Joi.string().optional(),
  format: Joi.string().optional(),
  reactionLabel: Joi.string().optional(),
});

type Options = Pick<AppOptions, "config" | "mongo" | "i18n">;

export const oembedProviderHandler = ({
  config,
  mongo,
  i18n,
}: Options): RequestHandler<TenantCoralRequest> => {
  return async (req, res, next) => {
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
      "featured-gotoConversation"
    );

    const {
      customFontsCSSURL,
      customCSSURL,
      staticURI,
      streamCSS,
      defaultFontsCSS,
    } = await getCommentEmbedCSS(tenant, { config });

    const formatter = getCommentEmbedCreatedAtFormatter(tenant);

    const tenantURL = constructTenantURL(config, tenant);

    try {
      const { url, allowReplies, format, reactionLabel } = validate(
        OEmbedServiceQuerySchema,
        req.query
      );

      // We don't currently support xml format responses
      if (format && format === "xml") {
        res.sendStatus(501);
        return;
      }

      // default to including reply/go to conversation interactions if no query param provided
      const includeReplies = allowReplies
        ? allowReplies === "true"
        : tenant.embeddedComments?.allowReplies;

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

        const story = await retrieveStory(mongo, tenant.id, comment.storyID);
        const commentPermalinkURL = `${story?.url}?commentID=${commentID}`;

        const {
          commentAuthor,
          commentRevision,
          mediaUrl,
          giphyMedia,
          externalMediaUrl,
          simpleEmbedMediaUrl,
        } = await getCommentEmbedData(mongo, comment, tenant.id);

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

        const simpleSingleCommentEmbed = nunjucks.render(
          "commentEmbed/simpleSingleCommentEmbed.html",
          {
            commentID,
            includeReplies,
            commentAuthor,
            sanitizedSimple,
            commentPermalinkURL,
            simpleEmbedMediaUrl,
          }
        );

        const iframeScript = `window.addEventListener("message", (e) => {const iframe = window.document.querySelector("#coral-comment-embed-shadowRoot-${commentID}").shadowRoot.querySelector("#embed-iframe-${commentID}"); if (e.data.commentID === '${commentID}' && iframe && e.data.height) {{iframe.height = e.data.height;}}});`;

        const html = nunjucks.render("commentEmbed/singleCommentEmbed.html", {
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
          staticRoot: staticURI || tenantURL,
          giphyMedia,
          sanitized,
          replyMessage,
          goToConversationMessage,
          reactionLabel,
          commentPermalinkURL,
          commentID,
          externalMediaUrl,
        });

        res.json({
          html,
          simpleSingleCommentEmbed,
          width: 0,
          height: 0,
          embeddedMediaIframeScript:
            mediaUrl || externalMediaUrl ? iframeScript : undefined,
        });
      }
    } catch (err) {
      next(err);
    }
  };
};
