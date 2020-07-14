import { AppOptions } from "coral-server/app";
import { calculateTotalPublishedCommentCount } from "coral-server/models/comment";
import { translate } from "coral-server/services/i18n";
import { find } from "coral-server/services/stories";
import { RequestHandler } from "coral-server/types/express";

const NUMBER_CLASS_NAME = "coral-count-number";
const TEXT_CLASS_NAME = "coral-count-text";

export type CountOptions = Pick<AppOptions, "mongo" | "tenantCache" | "i18n">;

/**
 * countHandler returns translated comment counts using JSONP.
 */
export const countHandler = ({
  mongo,
  i18n,
}: CountOptions): RequestHandler => async (req, res, next) => {
  try {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;
    const tenant = coral.tenant!;

    const story = await find(mongo, tenant, {
      id: req.query.id,
      url: req.query.url,
    });

    const count = story
      ? calculateTotalPublishedCommentCount(story.commentCounts.status)
      : 0;

    let html = "";
    if (req.query.notext === "true") {
      // We only need the count without the text.
      html = `<span class="${NUMBER_CLASS_NAME}">${count}</span>`;
    } else {
      // Use translated string.
      const bundle = i18n.getBundle(tenant.locale);
      html = translate(
        bundle,
        `<span class="${NUMBER_CLASS_NAME}">${count}</span> <span class="${TEXT_CLASS_NAME}">Comments</span>`,
        "comment-count",
        {
          number: count,
          numberClass: NUMBER_CLASS_NAME,
          textClass: TEXT_CLASS_NAME,
        }
      );
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
