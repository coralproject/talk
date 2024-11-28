import { findMediaLinks } from "coral-common/common/lib/helpers/findMediaLinks";
import validateImagePathname from "coral-common/common/lib/helpers/validateImagePathname";
import { WrappedInternalError } from "coral-server/errors";
import {
  BlueskyMedia,
  ExternalMedia,
  GiphyMedia,
  TenorMedia,
  TwitterMedia,
  YouTubeMedia,
} from "coral-server/models/comment";
import { supportsMediaType, Tenant } from "coral-server/models/tenant";
import {
  ratingIsAllowed,
  retrieveFromGiphy,
} from "coral-server/services/giphy";
import { fetchOEmbedResponse } from "coral-server/services/oembed";
import { retrieveFromTenor } from "coral-server/services/tenor";

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
    throw new WrappedInternalError(err as Error, "cannot attach Giphy Media");
  }
}

async function attachTenorMedia(
  tenant: Tenant,
  id: string,
  url: string
): Promise<TenorMedia | undefined> {
  const { results } = await retrieveFromTenor(tenant, id);
  if (!results || !(results.length === 1)) {
    return;
  }
  const data = results[0];
  try {
    // Return the formed Tenor Media.
    return {
      type: "tenor",
      id,
      url,
      title: data.title,
      still: data.media_formats.gifpreview.url,
      width: data.media_formats.gifpreview.dims[0],
      height: data.media_formats.gifpreview.dims[1],
      video: data.media_formats.mp4.url,
    };
  } catch (err) {
    if (!(err instanceof Error)) {
      throw new Error("cannot attach Tenor Media");
    }
    throw new WrappedInternalError(err, "cannot attach Tenor Media");
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
    throw new WrappedInternalError(
      err as Error,
      "cannot attach external media"
    );
  }
}

async function attachOEmbedMedia(
  type: "twitter" | "youtube" | "bsky",
  url: string,
  body: string
): Promise<YouTubeMedia | TwitterMedia | BlueskyMedia | undefined> {
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

    if (type === "twitter") {
      // Return the formed TwitterMedia.
      return {
        type: "twitter",
        url,
        width,
      };
    }

    if (type === "bsky") {
      return {
        type: "bsky",
        url,
        width,
      };
    }

    return undefined;
  } catch (err) {
    throw new WrappedInternalError(err as Error, "cannot attach oEmbed Media");
  }
}

export interface CreateCommentMediaInput {
  type: "giphy" | "tenor" | "twitter" | "bsky" | "youtube" | "external";
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
    case "tenor":
      if (!input.id) {
        throw new Error(
          "id is required when attaching a TenorMedia object to a comment"
        );
      }

      return attachTenorMedia(tenant, input.id, input.url);
    case "external":
      return attachExternalMedia(input.url, input.width, input.height);
    case "twitter":
    case "youtube":
    case "bsky":
      return attachOEmbedMedia(input.type, input.url, body);
    default:
      throw new Error("invalid media type");
  }
}
