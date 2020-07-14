import { findEmbedLinks } from "coral-common/helpers/findEmbedLinks";
import { EncodedCommentActionCounts } from "coral-server/models/action/comment";
import { supportsEmbedType, Tenant } from "coral-server/models/tenant";
import { WrappedInternalError } from "coral-server/errors";
import {
  ratingIsAllowed,
  retrieveFromGiphy,
} from "coral-server/services/giphy";
import { fetchOembedResponse } from "coral-server/services/oembed";

export interface RevisionMetadata {
  /**
   * akismet is true when it was determined to be spam.
   */
  akismet?: boolean;

  /**
   * linkCount is the number of links in a revision body that was detected.
   */
  linkCount?: number;

  /**
   * perspective stores the detected properties from checking with the
   * perspective model.
   */
  perspective?: {
    /**
     * score is the percentage likelihood (in decimal form) that the comment
     * matches the selected model.
     */
    score: number;

    /**
     * model is the perspective model used to determine the above score.
     */
    model: string;
  };

  /**
   * nudge when true indicates that the comment was written on the first try
   * without a warning.
   */
  nudge?: boolean;
}

export interface GiphyEmbed {
  type: "giphy";
  url: string;
  remoteID: string;
  original?: string;
  still?: string;
  video?: string;
  width?: number;
  height?: number;
  title?: string;
}

export interface TwitterEmbed {
  type: "twitter";
  url: string;
  width?: number;
  height?: number;
}

export interface YoutubeEmbed {
  type: "youtube";
  url: string;
  width?: number;
  height?: number;
}

export type CommentEmbed = GiphyEmbed | TwitterEmbed | YoutubeEmbed;

/**
 * Revision stores a Comment's body for a specific edit. Actions can be tied to
 * a Revision, as can moderation actions.
 */
export interface Revision {
  /**
   * id identifies this Revision.
   */
  readonly id: string;

  /**
   * body is the body text for this revision.
   */
  body: string;

  /**
   * actionCounts is the cached action counts on this revision.
   */
  actionCounts: EncodedCommentActionCounts;

  /**
   * metadata stores properties on this revision.
   */
  metadata: RevisionMetadata;

  /**
   * createdAt is the date that this revision was created at.
   */
  createdAt: Date;

  /**
   * embeds are the embedded link content found in the comment body.
   */
  embed?: CommentEmbed | null;
}

export interface CreateCommentEmbedInput {
  url: string;
  remoteID?: string;
  type: "giphy" | "twitter" | "youtube";
}

async function attachGiphyEmbed(
  remoteID: string,
  url: string,
  tenant: Tenant
): Promise<GiphyEmbed | null> {
  try {
    const data = await retrieveFromGiphy(remoteID, tenant);
    if (data && data.rating && ratingIsAllowed(data.rating, tenant)) {
      return {
        url,
        remoteID,
        type: "giphy",
        title: data.title,
        width: data.images.original.width,
        height: data.images.original.height,
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
