import { findMediaLinks } from "coral-common/helpers/findMediaLinks";
import validateImagePathname from "coral-common/helpers/validateImagePathname";
import { WrappedInternalError } from "coral-server/errors";
import {
  ExternalMedia,
  GiphyMedia,
  TwitterMedia,
  YouTubeMedia,
} from "coral-server/models/comment";
import { supportsMediaType, Tenant } from "coral-server/models/tenant";
import {
  ratingIsAllowed,
  retrieveFromGiphy,
} from "coral-server/services/giphy";
import { fetchOEmbedResponse } from "coral-server/services/oembed";

async function attachGiphyMedia(
  tenant: Tenant,
  id: string,
  url: string
): Promise<GiphyMedia | undefined> {
  try {
    // Get the response from Giphy.
    const { data } = await retrieveFromGiphy(tenant, id);
    if (!data) {
      return;
    }

    // Check to see if the rating is allowed.
    if (!data.rating || !ratingIsAllowed(data.rating, tenant)) {
      return;
    }

    // Parse some of the parameters.
    const width = parseInt(data.images.original.width, 10);
    const height = parseInt(data.images.original.height, 10);

    // Return the formed Giphy Media.
    return {
      type: "giphy",
      id,
      url,
      title: data.title,
      width,
      height,
      original: data.url,
      still: data.images.original_still.url,
      video: data.images.original.mp4,
    };
  } catch (err) {
    throw new WrappedInternalError(err, "cannot attach Giphy Media");
  }
}

async function attachExternalMedia(
  url: string,
  inputWidth?: string,
  inputHeight?: string
): Promise<ExternalMedia | undefined> {
  try {
    const parsed = new URL(url);
    if (!validateImagePathname(parsed.pathname)) {
      throw new Error("cannot attach external image");
    }

    const width = inputWidth ? parseInt(inputWidth, 10) : undefined;
    const height = inputHeight ? parseInt(inputHeight, 10) : undefined;

    return {
      type: "external",
      url,
      width,
      height,
    };
  } catch (err) {
    throw new WrappedInternalError(err, "cannot attach external media");
  }
}

async function attachOEmbedMedia(
  type: "twitter" | "youtube",
  url: string,
  body: string
): Promise<YouTubeMedia | TwitterMedia | undefined> {
  // Find all the media links in the body.
  const links = findMediaLinks(body);
  if (!links) {
    return;
  }

  // Ensure that the link that we're attaching matches the link found in the
  // body.
  const found = links.find((link) => link.type === type && link.url === url);
  if (!found) {
    return;
  }

  try {
    // Get the oEmbed response to save.
    const res = await fetchOEmbedResponse(type, url);
    if (!res) {
      return;
    }

    // Extract the response.
    const { width, height, thumbnail_url, title } = res;

    // If the type is YouTube, ensure that the thumbnail url is provided.
    if (type === "youtube") {
      if (height === null || !thumbnail_url) {
        return;
      }

      // Return the formed YouTubeMedia.
      return {
        type: "youtube",
        url,
        still: thumbnail_url,
        width,
        height,
        title,
      };
    }

    // Return the formed TwitterMedia.
    return {
      type: "twitter",
      url,
      width,
    };
  } catch (err) {
    throw new WrappedInternalError(err, "cannot attach oEmbed Media");
  }
}

export interface CreateCommentMediaInput {
  type: "giphy" | "twitter" | "youtube" | "external";
  url: string;
  id?: string;
  width?: string;
  height?: string;
}

export async function attachMedia(
  tenant: Tenant,
  input: CreateCommentMediaInput,
  body: string
) {
  if (!supportsMediaType(tenant, input.type)) {
    return;
  }

  switch (input.type) {
    case "giphy":
      if (!input.id) {
        throw new Error(
          "id is required when attaching a GiphyMedia object to a comment"
        );
      }

      return attachGiphyMedia(tenant, input.id, input.url);
    case "external":
      return attachExternalMedia(input.url, input.width, input.height);
    case "twitter":
    case "youtube":
      return attachOEmbedMedia(input.type, input.url, body);
    default:
      throw new Error("invalid media type");
  }
}
