import { GQLDisableCommentingTypeResolver } from "coral-server/graph/schema/__generated__/types";
import * as settings from "coral-server/models/settings";
import { translate } from "coral-server/services/i18n";

export const DisableCommenting: GQLDisableCommentingTypeResolver<
  settings.DisableCommenting
> = {
  message: (disableCommenting, input, ctx) => {
    if (disableCommenting.message) {
      return disableCommenting.message;
    }

    // Get the translation bundle.
    const bundle = ctx.i18n.getBundle(ctx.lang);

    // Translate the default close message.
    return translate(
      bundle,
      "Comments are closed on this story.",
      "disableCommentingDefaultMessage"
    );
  },
};
