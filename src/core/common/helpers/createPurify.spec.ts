import { JSDOM } from "jsdom";

import createPurify from "./createPurify";

const window = new JSDOM("", {}).window;
const purify = createPurify(window as any);

it("sanitizes out tags not allowed", () => {
  expect(
    purify.sanitize("<script type=\"text/javascript\">alert('ok');</script>")
  ).toMatchSnapshot();

  expect(
    purify.sanitize("<script src=malicious-code.js></script>")
  ).toMatchSnapshot();
});

it("sanitizes out attributes not allowed", () => {
  expect(purify.sanitize('<div id="test">Test</div>')).toMatchSnapshot();
});

it("allows anchor links", () => {
  expect(
    purify.sanitize('<a href="http://test.com">This is a link</a>')
  ).toMatchSnapshot();
});

it("allows mailto links", () => {
  expect(
    purify.sanitize('<a href="mailto:email@example.com">email@example.com</a>')
  ).toMatchSnapshot();
});

it("allows anchor tags and counts them correctly", () => {
  const el = purify.sanitize(
    `
    <div>
      <a href="https://mozilla.org/">Mozilla</a>
      <a href="https://mozilla.org/">Mozilla</a>
    </div>
  `,
    { RETURN_DOM: true }
  );

  expect(el.innerHTML).toMatchSnapshot();
  expect(el.getElementsByTagName("a").length).toEqual(2);
});

it("allows bolded tags", () => {
  expect(purify.sanitize("A <b>bolded comment!</b>")).toMatchSnapshot();
});
