import { findMediaLinks } from "coral-common/helpers/findMediaLinks";
import { WrappedInternalError } from "coral-server/errors";
import { GiphyMedia } from "coral-server/models/comment";
import { supportsMediaType, Tenant } from "coral-server/models/tenant";
import {
  ratingIsAllowed,
  retrieveFromGiphy,
} from "coral-server/services/giphy";
import { fetchOembedResponse } from "coral-server/services/oembed";

async function attachGiphyMedia(
  id: string,
  url: string,
  tenant: Tenant
): Promise<GiphyMedia | undefined> {
  try {
    const { data } = await retrieveFromGiphy(id, tenant);
    if (data && data.rating && ratingIsAllowed(data.rating, tenant)) {
      return {
        type: "giphy",
        id,
        url,
        title: data.title,
        width: parseInt(data.images.original.width, 10),
        height: parseInt(data.images.original.height, 10),
        original: data.url,
        still: data.images.original_still.url,
        video: data.images.original.mp4,
      };
    } else {
      return;
    }
  } catch (error) {
    throw new WrappedInternalError(error, "cannot attach gif");
  }
}

export interface CreateCommentMediaInput {
  type: "giphy" | "twitter" | "youtube";
  url: string;
  remoteID?: string;
}

export async function attachMedia(
  input: CreateCommentMediaInput,
  body: string,
  tenant: Tenant
) {
  if (
    supportsMediaType(tenant, "giphy") &&
    input.type === "giphy" &&
    input.remoteID
  ) {
    return attachGiphyMedia(input.remoteID, input.url, tenant);
  } else if (input.type === "twitter" || input.type === "youtube") {
    const foundLinks = findMediaLinks(body);
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

  return;
}
