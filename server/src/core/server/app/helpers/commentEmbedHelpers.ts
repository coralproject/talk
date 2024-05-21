import { createDateFormatter } from "coral-common/common/lib/date";
import { sanitizeAndFindFormattingTags } from "coral-common/common/lib/helpers/sanitize";
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
  let externalMediaUrl = null;
  let simpleEmbedMediaUrl = null;
  if (
    commentRevision.media?.type === "twitter" ||
    commentRevision.media?.type === "youtube"
  ) {
    mediaUrl = `api/oembed?type=${commentRevision.media?.type}&url=${commentRevision.media?.url}&siteID=${comment.siteID}&commentID=${comment.id}`;
  }
  if (commentRevision.media?.type === "external") {
    externalMediaUrl = `api/external-media?url=${commentRevision.media.url}&siteID=${comment.siteID}&commentID=${comment.id}`;
    simpleEmbedMediaUrl = externalMediaUrl;
  }
  if (commentRevision.media?.type === "giphy") {
    giphyMedia = commentRevision.media;
    if (!giphyMedia.video && !giphyMedia.title) {
      giphyMedia.title = "";
    }
    simpleEmbedMediaUrl = giphyMedia.url;
  }

  return {
    comment,
    commentAuthor,
    commentRevision,
    mediaUrl,
    giphyMedia,
    externalMediaUrl,
    simpleEmbedMediaUrl,
  };
}

export function transform(window: Window, source: string | Node) {
  // Sanitize source.
  const [sanitized, spoilerTags] = sanitizeAndFindFormattingTags(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
  const [sanitized, spoilerTags, sarcasmTags, blockquoteTags, links] =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    sanitizeAndFindFormattingTags(window as any, source);

  // Attach event handlers to spoiler tags.
  spoilerTags.forEach((node) => {
    node.setAttribute(
      "onclick",
      "{this.removeAttribute('style');this.removeAttribute('role');this.removeAttribute('title');this.removeAttribute('onclick');}"
    );
    node.setAttribute("role", "button");
    node.setAttribute("style", "background-color: #14171A; color: #14171A;");
    node.setAttribute("title", "Reveal spoiler");
    node.innerHTML = `<span aria-hidden="true">${node.innerHTML}</span>`;
  });

  // Add styles for sarcasm tags
  sarcasmTags.forEach((node) => {
    node.setAttribute("style", "font-family: monospace;");
  });

  // Add styles for blockquote tags
  blockquoteTags.forEach((node) => {
    node.setAttribute(
      "style",
      "background-color: #EAEFF0; border-radius: 3px; margin: 0.5rem 0 0.5rem 0.2rem; padding: 0.2rem;"
    );
  });
  links.forEach((node) => {
    node.setAttribute("style", "position: relative; z-index: 1;");
  });
  // Return results.
  return sanitized.innerHTML;
}
