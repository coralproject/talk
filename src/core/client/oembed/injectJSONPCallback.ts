import { COMMENT_EMBED_SELECTOR } from "coral-framework/constants";

export interface CommentEmbedJSONPData {
  ref: string;
  html: string;
  defaultFontsCSSURL: string;
  customFontsCSSURL?: string;
  commentID: string;
  staticRoot: string;
  includesIframe: boolean;
}

type GetCommentEmbedFunction = (opts?: { reset?: boolean }) => void;

function createCommentEmbedElementEnhancer({
  html,
  customFontsCSSURL,
  defaultFontsCSSURL,
  commentID,
  staticRoot,
  includesIframe,
}: CommentEmbedJSONPData) {
  return (target: HTMLElement) => {
    target.innerHTML = "";

    // Fonts must be included outside of the shadow dom
    const defaultFontsLink = window.document.createElement("link");
    defaultFontsLink.rel = "stylesheet";
    defaultFontsLink.href = `${staticRoot}${defaultFontsCSSURL}`;
    target.appendChild(defaultFontsLink);

    if (customFontsCSSURL) {
      const customFontsLink = window.document.createElement("link");
      customFontsLink.rel = "stylesheet";
      customFontsLink.href = customFontsCSSURL;
      target.appendChild(customFontsLink);
    }

    // Remove any styles applied by style attribute for simple comment embed
    target.removeAttribute("style");
    // Remove class attribute added to style simple comment embed
    target.classList.remove("coral-comment-embed-simple");

    const div = window.document.createElement("div");
    div.id = `coral-comment-embed-shadowRoot-${commentID}`;
    target.appendChild(div);

    // attaches a shadow root and sets its innerHTML to the comment embed html
    const shadowRoot = div.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;

    // Support iframe embeds, listens for height and sets it correctly on the iframe
    if (includesIframe) {
      const iframeHeightScript = window.document.createElement("script");
      iframeHeightScript.innerHTML = `window.addEventListener("message", (e) => {const iframe = window.document.querySelector("#coral-comment-embed-shadowRoot-${commentID}").shadowRoot.querySelector("#embed-iframe-${commentID}"); if (e.data.commentID === '${commentID}' && iframe && e.data.height) {{iframe.height = e.data.height;}}});`;
      shadowRoot.appendChild(iframeHeightScript);
    }
  };
}

/**
 * injectJSONPCallback will register the `CoralCommentEmbed` on the window.
 *
 * @param getCommentEmbed a function that when executed will allow you to grab the comment embed
 */
function injectJSONPCallback(getCommentEmbed: GetCommentEmbedFunction) {
  (window as any).CoralCommentEmbed = {
    setCommentEmbed: (data: CommentEmbedJSONPData) => {
      // Find all the elements with ref. These are the ones that should be
      // updated with this enhanced value.
      const elements = document.querySelectorAll(
        `${COMMENT_EMBED_SELECTOR}[data-coral-ref='${data.ref}']`
      );

      // Create the element enhancer. This helps when we
      const enhance = createCommentEmbedElementEnhancer(data);

      // For each of the found elements, enhance the element with the comment embed
      // data.
      Array.prototype.forEach.call(elements, (element: HTMLElement) => {
        enhance(element);
      });
    },
    getCommentEmbed,
    reload: () => getCommentEmbed(),
  };
}

export default injectJSONPCallback;
