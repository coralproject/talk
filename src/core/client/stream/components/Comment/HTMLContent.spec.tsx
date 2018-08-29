import React from "react";
import TestRenderer from "react-test-renderer";

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
        <span onClick=\"javascript:alert('haha')\" title="test">Hello world</span>
      `}
    </HTMLContent>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
