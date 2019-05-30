import { GQLTagTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";
import {
  COMMENT_TAG_TYPE_TRANSLATIONS,
  CommentTag,
} from "coral-server/models/comment/tag";
import { translate } from "coral-server/services/i18n";

export const Tag: GQLTagTypeResolver<CommentTag> = {
  name: ({ type }, input, ctx) => {
    // Get the translation bundle.
    const bundle = ctx.i18n.getBundle(ctx.lang);

    // Return the translated string.
    return translate(bundle, type, COMMENT_TAG_TYPE_TRANSLATIONS[type]);
  },
  code: ({ type }) => type,
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
};
