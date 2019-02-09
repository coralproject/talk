import { JSDOM } from "jsdom";

import { createPurify, sanitizeCommentBody } from "./purify";

const window = new JSDOM("", {}).window;
const DOMPurify = createPurify(window);

it("sanitizes out tags not allowed", () => {
  expect(
    sanitizeCommentBody(
      DOMPurify,
      "<script type=\"text/javascript\">alert('ok');</script>"
    )
  ).toMatchSnapshot();

  expect(
    sanitizeCommentBody(DOMPurify, "<script src=malicious-code.js></script>")
  ).toMatchSnapshot();
});

it("sanitizes out attributes not allowed", () => {
  expect(
    sanitizeCommentBody(DOMPurify, '<div id="test">Test</div>')
  ).toMatchSnapshot();
});

it("allows anchor links", () => {
  expect(
    sanitizeCommentBody(DOMPurify, '<a href="test">This is a link</a>')
  ).toMatchSnapshot();
});

it("allows anchor tags and counts them correctly", () => {
  const { body, linkCount } = sanitizeCommentBody(
    DOMPurify,
    `
    <div>
      <a href="https://mozilla.org/">Mozilla</a>
      <a href="https://mozilla.org/">Mozilla</a>
    </div>
  `
  );

  expect(body).toMatchSnapshot();
  expect(linkCount).toEqual(2);
});

it("allows bolded tags", () => {
  const input = "A <b>bolded comment!</b>";
  const { body } = sanitizeCommentBody(DOMPurify, input);
  expect(body).toEqual(input);
});
