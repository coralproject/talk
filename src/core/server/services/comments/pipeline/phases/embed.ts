import { supportsEmbedType } from "coral-server/models/tenant";

import {
  IntermediatePhaseResult,
  ModerationPhaseContext,
} from "coral-server/services/comments/pipeline";

import { findEmbedLinks } from "coral-server/app/helpers/findEmbedLinks";
import {
  ratingIsAllowed,
  retrieveFromGiphy,
} from "coral-server/services/giphy";
import { fetchOembedResponse } from "coral-server/services/oembed";

export const attachedEmbed = async ({
  comment,
  tenant,
}: Pick<
  ModerationPhaseContext,
  "comment" | "tenant"
>): Promise<IntermediatePhaseResult | void> => {
  if (comment.embeds && comment.embeds.length > 0) {
    const [embed] = comment.embeds;
    if (!tenant.embeds) {
      return;
    }

    if (
      supportsEmbedType(tenant, "giphy") &&
      embed.source === "GIPHY" &&
      embed.remote_id
    ) {
      try {
        const data = await retrieveFromGiphy(embed.remote_id, tenant);
        if (data && data.rating && ratingIsAllowed(data.rating, tenant)) {
          return {
            embeds: [
              {
                url: embed.url,
                source: embed.source,
                remote_id: embed.remote_id,
                title: data.title,
                width: data.images.original.width,
                height: data.images.original.height,
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
        const response = await fetchOembedResponse(
          embed.url,
          embed.source.toLowerCase()
        );

        if (response.ok) {
          const json = await response.json();
          return {
            embeds: [
              {
                url: matchingLink.url,
                source: matchingLink.source,
                width: json.width,
                height: json.height,
              },
            ],
          };
        }
      }
    }
  }

  return {
    embeds: [],
  };
};
