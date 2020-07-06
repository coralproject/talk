import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

import { findEmbedLinks } from "coral-common/utils/findEmbedLinks";
import { GQLEMBED_SOURCE } from "coral-server/graph/schema/__generated__/types";
import { fetchFromGiphy } from "coral-server/services/giphy";

const GIPHY_ALLOWED_RATINGS = ["g"];

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

    if (embed.source === "GIPHY") {
      if (tenant.embeds.giphy) {
        // GIPHY embed
        // ensure gif exists and is appropriate rating
        if (embed.id) {
          try {
            const data = await fetchFromGiphy(embed.id);
            if (
              data &&
              data.rating &&
              GIPHY_ALLOWED_RATINGS.includes(data.rating)
            ) {
              return {
                embeds: [embed],
              };
            }
          } catch (err) {
            throw new Error("Cannot attach gif");
          }
        }
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
              source: matchingLink.source as GQLEMBED_SOURCE,
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
