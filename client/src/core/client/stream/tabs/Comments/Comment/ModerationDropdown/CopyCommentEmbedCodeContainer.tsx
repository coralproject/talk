import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { graphql } from "react-relay";

import { sanitizeAndFindFormattingTags } from "coral-common/common/lib/helpers/sanitize";
import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { DropdownButton, DropdownDivider, Icon } from "coral-ui/components/v2";

import { CopyCommentEmbedCodeContainer_comment } from "coral-stream/__generated__/CopyCommentEmbedCodeContainer_comment.graphql";
import { CopyCommentEmbedCodeContainer_settings } from "coral-stream/__generated__/CopyCommentEmbedCodeContainer_settings.graphql";
import { CopyCommentEmbedCodeContainer_story } from "coral-stream/__generated__/CopyCommentEmbedCodeContainer_story.graphql";

import styles from "./CopyCommentEmbedCodeContainer.css";

interface Props {
  comment: CopyCommentEmbedCodeContainer_comment;
  settings: CopyCommentEmbedCodeContainer_settings;
  story: CopyCommentEmbedCodeContainer_story;
}

const CopyCommentEmbedCodeContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  story,
}) => {
  const { window } = useCoralContext();
  const [embedCodeCopied, setEmbedCodeCopied] = useState(false);
  const handleCopyEmbedCode = useCallback(() => {
    setEmbedCodeCopied(true);
  }, [setEmbedCodeCopied]);

  function transform(transformWindow: Window, source: string | Node) {
    // Sanitize source.
    const [sanitized, spoilerTags, sarcasmTags, blockquoteTags, linkTags] =
      sanitizeAndFindFormattingTags(transformWindow, source);

    // Attach event handlers to spoiler tags.
    spoilerTags.forEach((node) => {
      node.setAttribute(
        "onclick",
        "{this.removeAttribute('style');this.removeAttribute('role');this.removeAttribute('title');this.removeAttribute('onclick');}"
      );
      node.setAttribute("role", "button");
      node.setAttribute(
        "style",
        "background-color: #14171A; color: #14171A; position: relative; z-index: 1;"
      );
      node.setAttribute("title", "Reveal spoiler");
      node.innerHTML = `<span aria-hidden="true">${node.innerHTML}</span>`;
    });

    // Set styles for sarcasm tags
    sarcasmTags.forEach((node) => {
      node.setAttribute("style", "font-family: monospace;");
    });

    // Set styles for blockquote tags
    blockquoteTags.forEach((node) => {
      node.setAttribute(
        "style",
        "background-color: #EAEFF0; border-radius: 3px; margin: 0.5rem 0 0.5rem 0.2rem; padding: 0.2rem;"
      );
    });

    // Set styles for links
    // They need this styling to be clickable within overall clickable simple embed
    linkTags.forEach((node) => {
      node.setAttribute("style", "position: relative; z-index: 1;");
    });

    // Return results.
    return sanitized.innerHTML;
  }

  let sanitizedBody;
  if (comment.body) {
    sanitizedBody = transform(window, comment.body);
  }

  let mediaUrl = null;
  if (comment.revision?.media) {
    switch (comment.revision.media.__typename) {
      case "GiphyMedia":
        mediaUrl = comment.revision.media.url;
        break;
      case "ExternalMedia":
        mediaUrl = comment.revision.media.url;
        break;
      // Twitter and YouTube media embeds already have links in comments
      // so they don't also need to be added to the simple comment fallback
      case "%other" || "TwitterMedia" || "YouTubeMedia":
        break;
    }
  }

  const permalinkUrl = getURLWithCommentID(story.url, comment.id);

  const embedCode = `<div class="coral-comment-embed coral-comment-embed-simple" style="background-color: #f4f7f7; padding: 8px; position: relative;" data-commentID=${
    comment.id
  } data-reactionLabel="${
    settings.reaction.label
  }"><a target="_blank" style="position: absolute; z-index: 0; top: 0; bottom: 0; left: 0; right: 0;" href="${permalinkUrl}"></a><div style="margin-bottom: 8px;">${
    comment.author?.username
  }</div><div>${sanitizedBody}${
    mediaUrl
      ? `<div><br><a href="${mediaUrl}" target="_blank" rel="noopener noreferrer ugc" style="position: relative; z-index: 1;">${mediaUrl}</a></div>`
      : ""
  }</div></div>`;

  return (
    <>
      <DropdownDivider />
      <CopyToClipboard text={embedCode} onCopy={handleCopyEmbedCode}>
        {embedCodeCopied ? (
          <DropdownButton
            className={cn(styles.label, styles.embedCodeCopied)}
            icon={
              <Icon color="success" size="md">
                check_circle_outline
              </Icon>
            }
          >
            <Localized id="comments-moderationDropdown-embedCodeCopied">
              <span>Code copied</span>
            </Localized>
          </DropdownButton>
        ) : (
          <DropdownButton
            className={styles.label}
            icon={<Icon size="md">code</Icon>}
          >
            <Localized id="comments-moderationDropdown-embedCode">
              <span>Embed comment</span>
            </Localized>
          </DropdownButton>
        )}
      </CopyToClipboard>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment CopyCommentEmbedCodeContainer_comment on Comment {
      id
      author {
        id
        username
      }
      body
      revision {
        id
        media {
          __typename
          ... on GiphyMedia {
            url
          }
          ... on TwitterMedia {
            url
          }
          ... on YouTubeMedia {
            url
          }
          ... on ExternalMedia {
            url
          }
        }
      }
    }
  `,
  story: graphql`
    fragment CopyCommentEmbedCodeContainer_story on Story {
      url
    }
  `,
  settings: graphql`
    fragment CopyCommentEmbedCodeContainer_settings on Settings {
      embeddedComments {
        allowReplies
      }
      reaction {
        label
      }
    }
  `,
})(CopyCommentEmbedCodeContainer);

export default enhanced;
