import timekeeper from "timekeeper";

beforeAll(async () => {
  timekeeper.freeze(new Date(1589310827300));

  const script = document.createElement("script");
  script.src = "http://localhost:8080/assets/js/commentEmbed.js";
  Object.defineProperty(window.document, "currentScript", {
    value: script,
  });

  const link = document.createElement("link");
  link.rel = "canonical";
  link.href = "http://localhost:8080/";
  document.head.appendChild(link);
});

afterAll(() => {
  timekeeper.reset();
});

function attachTag(attrs: object) {
  const element = document.createElement("div");
  element.className = "coral-comment-embed coral-comment-embed-simple";
  element.setAttribute("style", "background-color:#F4F7F7; padding: 8px;");
  const simpleCommentDiv =
    '<div style="margin-bottom: 8px;">Username</div><div>I am a comment. I am a comment. I am a comment. I am a comment. I am' +
    "a comment. I am a comment. I am a comment. I am a comment. I am a comment.</div>";
  element.innerHTML = simpleCommentDiv;
  Object.assign(element.dataset, attrs);
  document.body.appendChild(element);
}

beforeEach(async () => {
  document.body.innerHTML = "";
  const tags = [
    {
      commentid: "12345678910",
    },
  ];

  tags.forEach((attrs) => {
    attachTag(attrs);
  });

  (await import("../")).main();
});

it("Sets the JSONP callback", async () => {
  expect((window as any).CoralCommentEmbed).toBeDefined();
});

it("Calls JSONP", async () => {
  expect(document.body).toMatchSnapshot();
});

it("Inject embedded comment", async () => {
  (window as any).CoralCommentEmbed.setCommentEmbed({
    ref: "MTIzNDU2Nzg5MTA=",
    html: '<!DOCTYPE html>\n<html lang="en-US">\n  <head>\n    \n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, user-scalable=no" />\n<base href="/" />\n    <link type="text/css" rel="stylesheet" href="assets/css/stream.d8d0c6b36a8a78561206aa73de58adab.css"/>\n  \n  \n <style>\n  #coral {\n    position: relative;\n  }\n  body {\n    margin: 0;\n  }\n  svg {\n    height: 14px;\n    width: 14px;\n    margin-right: var(--spacing-1);\n  }\n  .coral-commentEmbed {\n    background-color: var(--palette-grey-100);\n    padding: var(--spacing-2);\n  }\n  .coral-comment-content {\n    font-family: var(--font-family-primary);\n    font-style: normal;\n    font-weight: var(--font-weight-primary-regular);\n    font-size: var(--font-size-3);\n    line-height: 1.45;\n    color: var(--palette-text-500);\n    word-wrap: break-word;\n    margin: 0 0 calc(1.5 * var(--mini-unit)) 0;\n  }\n  .coral-comment-timestamp {\n    font-family: var(--font-family-primary);\n    font-style: normal;\n    font-weight: var(--font-weight-primary-semi-bold);\n    font-size: var(--font-size-2);\n    color: var(--palette-grey-500);\n  }\n  .coral-comment-username {\n    font-family: var(--font-family-secondary);\n    font-weight: bold;\n    font-size: var(--font-size-4);\n    margin-right: var(--spacing-2);\n  }\n  .coral-comment-topBar {\n    display: flex;\n    margin: 0 0 calc(0.5 * var(--mini-unit)) 0;\n    justify-content: space-between;\n  }\n  .coral-comment-avatar {\n    align-self: flex-end;\n  }\n  .coral-comment-avatar img {\n    height: 24px;\n    width: 24px;\n  }\n  .coral-comment-leftActions {\n    display: flex;\n  }\n  .coral-comment-actionBar {\n    display: flex;\n    justify-content: space-between;\n    font-family: var(--font-family-primary);\n    font-size: var(--font-size-2);\n  }\n  .coral-comment-actionBar a:hover {\n    color: var(--palette-grey-600);\n  }\n  /* together, the below two styles allow for nested links\n  so that the overall embed comment link and more specific replies/\n  goToConversation/etc. all have their own query params */\n  .coral-comment-actionBar a {\n    text-decoration: none;\n    color: var(--palette-grey-500);\n    align-items: center;\n    display: flex;\n    position: relative;\n    z-index: 1;\n  }\n  .overall-embed-link::before {\n    content: "";\n    position: absolute;\n    z-index: 0;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n  }\n  /* styles to support formatting within comments */\n  .coral-rte-spoiler {\n    position: relative;\n    z-index: 1;\n    background-color: var(--palette-text-900);\n    color: var(--palette-text-900);\n  }\n  .coral-rte-sarcasm {\n    font-family: monospace;\n  }\n  blockquote {\n    background-color: var(--palette-grey-200);\n    border-radius: var(--round-corners);\n    margin: calc(2 * var(--mini-unit)) 0 calc(2 * var(--mini-unit))\n      var(--mini-unit);\n    padding: var(--mini-unit);\n  }\n  /* styles for buttons within comment embed */\n  .coral-comment-goToConversation {\n    align-self: flex-end;\n    padding: var(--spacing-1);\n    display: flex;\n  }\n  .coral-comment-reactButton {\n    padding: var(--spacing-1);\n    display: flex;\n  }\n  .coral-comment-replyButton {\n    padding: var(--spacing-1);\n    display: flex;\n  }\n</style>\n  \n    \n    <title></title>\n\n    \n  </head>\n  <body>\n<div id="coral">\n  <!-- A hidden link for the overall comment embed that is styled to fill embed -->\n  <a\n    class="overall-embed-link"\n    href="http://localhost:8080/?commentID=c3e4c3fc-1de3-45bb-826b-6e29ffff8ea8&embedInteraction=generalEmbed"\n    target="_blank"\n  ></a>\n  <div class="coral coral-commentEmbed">\n      <div class="coral coral-comment coral-reacted-0">\n        <div class="coral coral-comment-topBar">\n          <div class="coral coral-comment-leftActions">\n            <div class="coral coral-username coral-comment-username">\n              username\n            </div>\n            <div class="coral coral-timestamp coral-comment-timestamp">\n              May 4, 2023, 11:37 AM\n            </div>\n          </div>\n          <div class="coral coral-comment-avatar">\n            <img src="https://cdn.vox-cdn.com/thumbor/rK3rErK9JxaIgdWGm-KwixKVAG4=/512x512/cdn.vox-cdn.com/profile_images/2653780/Kobe.jpg" />\n          </div>\n        </div>\n        <div class="coral coral-content coral-comment-content">\n <div>comment with <span class="coral-rte-spoiler" onclick="{this.classList.remove(\'coral-rte-spoiler\');this.classList.add(\'coral-rte-spoiler-reveal\');this.removeAttribute(\'role\');this.removeAttribute(\'title\');this.removeAttribute(\'onclick\');}" role="button" title="Reveal spoiler"><span aria-hidden="true">spoiler</span></span> text</div>           </div>\n        <div class="coral coral-comment-actionBar">\n          <div class="coral coral-comment-leftActions">\n            <div class="coral coral-reactButton coral-comment-reactButton">\n              <a\n                href="http://localhost:8080/?commentID=c3e4c3fc-1de3-45bb-826b-6e29ffff8ea8&embedInteraction=react"\n                target="_blank"\n              >\n                <svg\n                  xmlns="http://www.w3.org/2000/svg"\n                  fill="none"\n                  viewBox="-0.25 -0.25 24.5 24.5"\n                  stroke-width="2"\n                >\n                  <path\n                    stroke="currentColor"\n                    stroke-linecap="round"\n                    stroke-linejoin="round"\n                    stroke-miterlimit="10"\n                    d="M20.25 12.4299H21.45C22.45 12.4299 23.25 13.2299 23.25 14.2299C23.25 15.2299 22.45 16.0299 21.45 16.0299H20.25"\n                  ></path>\n                  <path\n                    stroke="currentColor"\n                    stroke-linecap="round"\n                    stroke-linejoin="round"\n                    stroke-miterlimit="10"\n                    d="M20.25 19.6299H20.55C21.55 19.6299 22.35 18.8299 22.35 17.8299C22.35 16.8299 21.55 16.0299 20.55 16.0299H20.25"\n                  ></path>\n                  <path\n                    stroke="currentColor"\n                    stroke-linecap="round"\n                    stroke-linejoin="round"\n                    stroke-miterlimit="10"\n                    d="M20.2499 12.4299H20.9499C21.9499 12.4299 22.7499 11.6299 22.7499 10.6299C22.7499 9.62993 21.9499 8.82995 20.9499 8.82995H20.2499H14.9499L15.0499 8.62993C16.0499 6.92993 16.6499 4.92995 16.7499 2.82995C16.8499 2.12995 16.5499 1.52993 15.9499 1.12993C15.5499 0.829933 15.1499 0.829921 14.6499 0.929921C14.1499 1.02992 13.7499 1.32994 13.5499 1.72994C11.5104 5.29895 10.1527 9.80017 6.6499 12.3299H4.25"\n                  ></path>\n                  <path\n                    stroke="currentColor"\n                    stroke-linecap="round"\n                    stroke-linejoin="round"\n                    stroke-miterlimit="10"\n                    d="M20.25 19.6299H19.55C20.65 19.6299 21.45 20.5299 21.25 21.6299C21.15 22.5299 20.35 23.1299 19.45 23.1299H12.95C12.55 23.1299 12.05 23.1299 11.65 23.0299L6.35 22.1299H4.25"\n                  ></path>\n                  <path\n                    stroke="currentColor"\n                    stroke-linecap="round"\n                    stroke-linejoin="round"\n                    stroke-miterlimit="10"\n                    d="M4.25 10.6299H0.75V23.1299H4.25V10.6299Z"\n                  ></path>\n                </svg>\nRec </a\n              >\n            </div>\n            <div class="coral coral-comment-replyButton">\n              <a\n                href="http://localhost:8080/?commentID=c3e4c3fc-1de3-45bb-826b-6e29ffff8ea8&embedInteraction=reply"\n                target="_blank"\n              >\n                <svg\n                  viewBox="-0.25 -0.25 24.5 24.5"\n                  xmlns="http://www.w3.org/2000/svg"\n                  stroke-width="2"\n                >\n                  <path\n                    d="M9.709,6.837a1.5,1.5,0,0,0-2.6-1.018L1.648,11.733a1.5,1.5,0,0,0,0,2.034l5.458,5.914a1.5,1.5,0,0,0,2.6-1.018V15.75h6a7.5,7.5,0,0,1,7.5,7.5v-6a7.5,7.5,0,0,0-7.5-7.5h-6Z"\n                    fill="none"\n                    stroke="currentColor"\n                    stroke-linecap="round"\n                    stroke-linejoin="round"\n                  ></path>\n                </svg>\n                Reply</a\n              >\n            </div>\n          </div>\n          <div class="coral coral-comment-goToConversation">\n            <a\n              href="http://localhost:8080/?commentID=c3e4c3fc-1de3-45bb-826b-6e29ffff8ea8&embedInteraction=goToConversation"\n              target="_blank"\n            >\n              <svg\n                viewBox="-0.25 -0.25 24.5 24.5"\n                xmlns="http://www.w3.org/2000/svg"\n                stroke-width="2"\n              >\n                <path\n                  d="M21.75,8.25h-12l-4.5,4.5V8.25h-3a1.5,1.5,0,0,1-1.5-1.5V2.25A1.5,1.5,0,0,1,2.25.75h19.5a1.5,1.5,0,0,1,1.5,1.5v4.5A1.5,1.5,0,0,1,21.75,8.25Z"\n                  fill="none"\n                  stroke="currentColor"\n                  stroke-linecap="round"\n                  stroke-linejoin="round"\n                ></path>\n                <path\n                  d="M2.25,11.25a1.5,1.5,0,0,0-1.5,1.5v4.5a1.5,1.5,0,0,0,1.5,1.5h12l4.5,4.5v-4.5h3a1.5,1.5,0,0,0,1.5-1.5v-4.5a1.5,1.5,0,0,0-1.5-1.5H11.25"\n                  fill="none"\n                  stroke="currentColor"\n                  stroke-linecap="round"\n                  stroke-linejoin="round"\n                ></path>\n              </svg>\n              Go to conversation</a\n            >\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n    </body>\n</html>\n',
    customFontsCSSURL: "https://www.customfonts.url",
    defaultFontsCSSURL: "https://www.defaultfonts.url",
  });
  expect(document.body).toMatchSnapshot();
  expect(
    document.body.getElementsByClassName("coral-comment-embed-shadowRoot")[0]
      .shadowRoot?.innerHTML
  ).toMatchSnapshot();
});
