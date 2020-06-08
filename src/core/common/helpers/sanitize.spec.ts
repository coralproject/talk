import { JSDOM } from "jsdom";

import { SPOILER_CLASSNAME } from "coral-common/constants";

import { ALL_FEATURES, createSanitize } from "./sanitize";

const window = new JSDOM("", {}).window;

it("sanitizes out tags not allowed", () => {
  const sanitize = createSanitize(window as any, {
    features: ALL_FEATURES,
  });
  expect(
    sanitize("<script type=\"text/javascript\">alert('ok');</script>")
  ).toMatchSnapshot();

  expect(sanitize("<script src=malicious-code.js></script>")).toMatchSnapshot();
});

it("sanitizes out attributes not allowed", () => {
  const sanitize = createSanitize(window as any, {
    features: ALL_FEATURES,
  });
  expect(sanitize('<div id="test">Test</div>')).toMatchSnapshot();
});

it("sanitizes without features enabled", () => {
  const sanitize = createSanitize(window as any);
  expect(
    sanitize(
      `
    <div>
      <ul>
      <li><b>Strong<b></li>
      <li><strong>Strong<strong></li>
      <li><i>Italic<i></li>
      <li><em>Italic<em></li>
      </ul>
      <blockquote>Blockquote</blockquote>
      <s>Strike</s>
      <span class="${SPOILER_CLASSNAME}">Spoiler</span>
    </div>
  `
    )
  ).toMatchSnapshot();
});

it("allows anchor links", () => {
  const sanitize = createSanitize(window as any);
  expect(
    sanitize('<a href="http://test.com">This is a link</a>')
  ).toMatchSnapshot();
});

it("allows mailto links", () => {
  const sanitize = createSanitize(window as any);
  expect(
    sanitize('<a href="mailto:email@example.com">email@example.com</a>')
  ).toMatchSnapshot();
});

it("allows anchor tags and counts them correctly", () => {
  const sanitize = createSanitize(window as any);
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
  const sanitize = createSanitize(window as any, {
    features: {
      bold: true,
    },
  });
  expect(sanitize("A <b>bolded comment!</b>")).toMatchSnapshot();
  expect(sanitize("A <strong>bolded comment!</strong>")).toMatchSnapshot();
});

it("allows italic tags", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      italic: true,
    },
  });
  expect(sanitize("<em>italic!</em>")).toMatchSnapshot();
  expect(sanitize("<i>italic!</i>")).toMatchSnapshot();
});

it("allows bulleted list", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      bulletList: true,
    },
  });
  expect(sanitize("<ul><li>bulleted list</li></ul>")).toMatchSnapshot();
});

it("allows blockquote", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      blockquote: true,
    },
  });
  expect(sanitize("<blockquote>bulleted list</blockquote>")).toMatchSnapshot();
});

it("allows strikthrough", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      strikethrough: true,
    },
  });
  expect(sanitize("<s>strikethrough</s>")).toMatchSnapshot();
});

it("allows spoiler", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      spoiler: true,
    },
  });
  expect(
    sanitize(`<span class="${SPOILER_CLASSNAME}">Spoiler</span>`)
  ).toMatchSnapshot();
});
