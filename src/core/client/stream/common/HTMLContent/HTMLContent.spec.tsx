import React from "react";
import TestRenderer from "react-test-renderer";

import { SPOILER_CLASSNAME } from "coral-common/constants";

import HTMLContent from "./HTMLContent";

it("renders correctly", () => {
  const renderer = TestRenderer.create(
    <HTMLContent>{"<span>Hello world</span>"}</HTMLContent>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("sanitizes evil html", () => {
  const renderer = TestRenderer.create(
    <HTMLContent>
      {`
        <script>alert('I am evil')</script>
        <span onClick="javascript:alert('haha')" title="test">Hello world</span>
      `}
    </HTMLContent>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("transform spoiler tags", () => {
  const revealed = `<span aria-hidden="true">Spoiler</span>`;
  const renderer = TestRenderer.create(
    <HTMLContent>
      {`
        <span class="${SPOILER_CLASSNAME}">Spoiler</span>
      `}
    </HTMLContent>
  );

  // Check for transformation of unrevealed spoiler.
  const html = renderer.toTree()?.rendered?.props.dangerouslySetInnerHTML
    .__html;
  expect(html).toMatchSnapshot();

  // Reveal on click.
  const div = document.createElement("div");
  div.innerHTML = html;
  (global as any).handleCoralSpoilerButton(div, new MouseEvent("click"));
  expect(div.innerHTML).toEqual(revealed);

  // Not reveal on unrelated keydown.
  div.innerHTML = html;
  (global as any).handleCoralSpoilerButton(
    div,
    new KeyboardEvent("keydown", { key: "a" })
  );
  expect(div.innerHTML).toEqual(html);

  // Reveal on enter.
  (global as any).handleCoralSpoilerButton(
    div,
    new KeyboardEvent("keydown", { key: "Enter" })
  );
  expect(div.innerHTML).toEqual(revealed);
});
