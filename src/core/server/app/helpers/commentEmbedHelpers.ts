import { createDateFormatter } from "coral-common/date";
import { sanitizeAndFindSpoilerTags } from "coral-common/helpers/sanitize";
import { MongoContext } from "coral-server/data/context";
import { Comment } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";

import { AppOptions } from "..";
import { createManifestLoader } from "./manifestLoader";

export async function getCommentEmbedCSS(
  tenant: Tenant,
  { config }: Pick<AppOptions, "config">
) {
  const customFontsCSSURL = tenant.customFontsCSSURL;
  const customCSSURL = tenant.customCSSURL;
  const staticURI = config.get("static_uri");

  const manifestLoader = createManifestLoader(config, "asset-manifest.json");

  const streamEntrypointLoader =
    manifestLoader.createEntrypointLoader("stream");
  const entrypoint = await streamEntrypointLoader();
  const streamCSS = entrypoint?.css.filter((css) =>
    css.src.includes("assets/css/stream")
  );
  const defaultFontsCSS = (await manifestLoader.load())[
    "assets/css/typography.css"
  ];

  return {
    customFontsCSSURL,
    customCSSURL,
    streamCSS,
    defaultFontsCSS,
    staticURI,
  };
}

export function getCommentEmbedCreatedAtFormatter(tenant: Tenant) {
  return createDateFormatter(tenant.locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function getCommentEmbedData(
  mongo: MongoContext,
  comment: Readonly<Comment>,
  tenantID: string
) {
  let commentAuthor = null;
  if (comment.authorID) {
    commentAuthor = await retrieveUser(mongo, tenantID, comment.authorID);
  }

  // the latest comment revision
  const commentRevision = comment.revisions[comment.revisions.length - 1];

  let mediaUrl = null;
  let giphyMedia = null;
  if (
    commentRevision.media?.type === "twitter" ||
    commentRevision.media?.type === "youtube"
  ) {
    mediaUrl = `/api/oembed?type=${commentRevision.media?.type}&url=${commentRevision.media?.url}&siteID=${comment.siteID}`;
  }
  if (commentRevision.media?.type === "external") {
    mediaUrl = `/api/external-media?url=${commentRevision.media.url}&siteID=${comment.siteID}`;
  }
  if (commentRevision.media?.type === "giphy") {
    giphyMedia = commentRevision.media;
    if (!giphyMedia.video && !giphyMedia.title) {
      giphyMedia.title = "";
    }
  }

  return { comment, commentAuthor, commentRevision, mediaUrl, giphyMedia };
}

export function transform(window: Window, source: string | Node) {
  // Sanitize source.
  const [sanitized, spoilerTags] = sanitizeAndFindSpoilerTags(
    window as any,
    source
  );

  // Attach event handlers to spoiler tags.
  spoilerTags.forEach((node) => {
    node.setAttribute(
      "onclick",
      "{this.classList.remove('coral-rte-spoiler');this.classList.add('coral-rte-spoiler-reveal');this.removeAttribute('role');this.removeAttribute('title');this.removeAttribute('onclick');}"
    );
    node.setAttribute("role", "button");
    node.setAttribute("title", "Reveal spoiler");
    node.innerHTML = `<span aria-hidden="true">${node.innerHTML}</span>`;
  });
  // Return results.
  return sanitized.innerHTML;
}

export function transformSimpleEmbed(window: Window, source: string | Node) {
  // Sanitize source.
  const [sanitized, spoilerTags] = sanitizeAndFindSpoilerTags(
    window as any,
    source
  );

  // Attach event handlers to spoiler tags.
  spoilerTags.forEach((node) => {
    node.setAttribute(
      "onclick",
      "{this.removeSttribute('style');this.removeAttribute('role');this.removeAttribute('title');this.removeAttribute('onclick');}"
    );
    node.setAttribute("role", "button");
    // TODO: Make this the correct color
    node.setAttribute("style", "background-color: black;");
    node.setAttribute("title", "Reveal spoiler");
    node.innerHTML = `<span aria-hidden="true">${node.innerHTML}</span>`;
  });
  // Return results.
  return sanitized.innerHTML;
}
