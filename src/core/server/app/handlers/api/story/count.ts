import { RequestHandler } from "coral-server/types/express";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import { AppOptions } from "coral-server/app";
import { calculateTotalPublishedCommentCount } from "coral-server/models/story";
import { translate } from "coral-server/services/i18n";
import { find } from "coral-server/services/stories";

const NUMBER_CLASSNAME = "coral-count-number";
const TEXT_CLASSNAME = "coral-count-text";

export type CountOptions = Pick<AppOptions, "mongo" | "tenantCache" | "i18n">;

/**
 * countHandler returns translated comment counts using JSONP.
 */
export const countHandler = ({ mongo, i18n }: CountOptions): RequestHandler => {
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);

  return async (req, res, next) => {
    try {
      // Tenant is guaranteed at this point.
      const coral = req.coral!;
      const tenant = coral.tenant!;

      const story = await find(mongo, tenant, {
        id: req.query.id,
        url: req.query.url,
      });
      if (!story) {
        throw new Error("Story not found");
      }

      const count = calculateTotalPublishedCommentCount(
        story.commentCounts.status
      );

      let html = "";
      if (req.query.notext === "true") {
        // We only need the count without the text.
        html = `<span class="${NUMBER_CLASSNAME}">${count}</span>`;
      } else {
        // Use translated string.
        const bundle = i18n.getBundle(tenant.locale);
        html = translate(
          bundle,
          `<span class="${NUMBER_CLASSNAME}">${count}</span> <span class="${TEXT_CLASSNAME}">Comments</span>`,
          "comment-count",
          {
            number: count,
            numberClass: NUMBER_CLASSNAME,
            textClass: TEXT_CLASSNAME,
          }
        );
        // Strip dangerous html from translation.
        html = DOMPurify.sanitize(html);
      }

      // Respond using jsonp.
      res.jsonp({
        // Reference from the client that we'll just send back as it is.
        ref: req.query.ref,
        html,
      });
    } catch (err) {
      return next(err);
    }
  };
};
