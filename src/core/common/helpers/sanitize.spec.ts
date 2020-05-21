import { JSDOM } from "jsdom";

import { createSanitize } from "./sanitize";

const window = new JSDOM("", {}).window;
const sanitize = createSanitize(window as any);

it("sanitizes out tags not allowed", () => {
  expect(
    sanitize("<script type=\"text/javascript\">alert('ok');</script>")
  ).toMatchSnapshot();

  expect(sanitize("<script src=malicious-code.js></script>")).toMatchSnapshot();
});

it("sanitizes out attributes not allowed", () => {
  expect(sanitize('<div id="test">Test</div>')).toMatchSnapshot();
});

it("allows anchor links", () => {
  expect(
    sanitize('<a href="http://test.com">This is a link</a>')
  ).toMatchSnapshot();
});

it("allows mailto links", () => {
  expect(
    sanitize('<a href="mailto:email@example.com">email@example.com</a>')
  ).toMatchSnapshot();
});

it("allows anchor tags and counts them correctly", () => {
  const el = sanitize(
    `
    <div>
      <a href="https://mozilla.org/">Mozilla</a>
      <a href="https://mozilla.org/">Mozilla</a>
    </div>
  `
  );

  expect(el.innerHTML).toMatchSnapshot();
  expect(el.getElementsByTagName("a").length).toEqual(2);
});

it("allows bolded tags", () => {
  expect(sanitize("A <b>bolded comment!</b>")).toMatchSnapshot();
});
