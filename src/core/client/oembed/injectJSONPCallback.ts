export interface CommentEmbedJSONPData {
  ref: string;
  html: string;
  defaultFontsCSSURL: string;
  customFontsCSSURL?: string;
}

type GetCommentEmbedFunction = (opts?: { reset?: boolean }) => void;

function createCommentEmbedElementEnhancer({
  html,
  customFontsCSSURL,
  defaultFontsCSSURL,
}: CommentEmbedJSONPData) {
  return (target: HTMLElement) => {
    target.innerHTML = "";

    // Fonts must be included outside of the shadow dom
    const defaultFontsLink = window.document.createElement("link");
    defaultFontsLink.rel = "stylesheet";
    defaultFontsLink.href = defaultFontsCSSURL;
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
    div.className = "coral-comment-embed-shadowRoot";
    target.appendChild(div);
    const shadowRoot = div.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = html;
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
        `${".coral-comment-embed"}[data-coral-ref='${data.ref}']`
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
