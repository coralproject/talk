import { findEmbedLinks } from "coral-common/helpers/findEmbedLinks";
import { WrappedInternalError } from "coral-server/errors";
import {
  CreateCommentEmbedInput,
  GiphyEmbed,
} from "coral-server/models/comment";
import { supportsEmbedType, Tenant } from "coral-server/models/tenant";
import {
  ratingIsAllowed,
  retrieveFromGiphy,
} from "coral-server/services/giphy";
import { fetchOembedResponse } from "coral-server/services/oembed";

async function attachGiphyEmbed(
  remoteID: string,
  url: string,
  tenant: Tenant
): Promise<GiphyEmbed | null> {
  try {
    const { data } = await retrieveFromGiphy(remoteID, tenant);
    if (data && data.rating && ratingIsAllowed(data.rating, tenant)) {
      return {
        url,
        type: "giphy",
        title: data.title,
        width: parseInt(data.images.original.width, 10),
        height: parseInt(data.images.original.height, 10),
        original: data.url,
        still: data.images.original_still.url,
        video: data.images.original.mp4,
      };
    } else {
      return null;
    }
  } catch (error) {
    throw new WrappedInternalError(error, "Cannot attach gif");
  }
}

export async function attachEmbed(
  input: CreateCommentEmbedInput | null,
  body: string,
  tenant: Tenant
) {
  if (!input) {
    return null;
  }
  if (
    input.type === "giphy" &&
    supportsEmbedType(tenant, "giphy") &&
    input.remoteID
  ) {
    return attachGiphyEmbed(input.remoteID, input.url, tenant);
  } else if (input.type === "twitter" || input.type === "youtube") {
    const foundLinks = findEmbedLinks(body);
    const matchingLink = foundLinks.find((link) => {
      return link.url === input.url;
    });
    if (matchingLink) {
      const response = await fetchOembedResponse(input.url, input.type);

      if (response.ok) {
        const json = await response.json();
        return {
          type: input.type,
          url: matchingLink.url,
          width: json.width,
          height: json.height,
        };
      }
    }
  }
  return null;
}
