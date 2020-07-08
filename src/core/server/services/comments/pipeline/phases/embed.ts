import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

import { findEmbedLinks } from "coral-server/app/helpers/findEmbedLinks";
import { fetchFromGiphy, ratingIsAllowed } from "coral-server/services/giphy";

export const attachedEmbed = async ({
  comment,
  tenant,
  now,
}: Pick<
  ModerationPhaseContext,
  "comment" | "tenant" | "now"
>): Promise<IntermediatePhaseResult | void> => {
  if (comment.embeds && comment.embeds.length > 0) {
    const [embed] = comment.embeds;

    if (
      tenant.embeds.giphy &&
      tenant.embeds.giphyAPIKey &&
      embed.source === "GIPHY" &&
      embed.remote_id
    ) {
      try {
        const data = await fetchFromGiphy(
          embed.remote_id,
          tenant.embeds.giphyAPIKey
        );
        if (
          data &&
          data.rating &&
          ratingIsAllowed(data.rating, tenant.embeds.giphyMaxRating)
        ) {
          return {
            embeds: [
              {
                url: embed.url,
                source: embed.source,
                remote_id: embed.remote_id,
                title: data.title,
                media: {
                  original: data.url,
                  still: data.images.original_still.url,
                  video: data.images.original.mp4,
                },
              },
            ],
          };
        }
      } catch (err) {
        throw new Error("Cannot attach gif");
      }
    } else if (embed.source === "TWITTER" || embed.source === "YOUTUBE") {
      // TWITTER or YOUTUBE embed
      // ensure matches body contents
      const foundLinks = findEmbedLinks(comment.body);
      const matchingLink = foundLinks.find((link) => {
        return link.url === embed.url && link.source === embed.source;
      });
      if (matchingLink) {
        return {
          embeds: [
            {
              url: matchingLink.url,
              source: matchingLink.source,
            },
          ],
        };
      }
    }
  }

  return {
    embeds: [],
  };
};
