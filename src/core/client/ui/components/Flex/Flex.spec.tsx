import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import Flex from "./Flex";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Flex> = {
    justifyContent: "center",
    alignItems: "center",
    direction: "row",
  };
  const renderer = TestRenderer.create(
    <Flex {...props}>
      <div>Hello World</div>
    </Flex>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders with wrap", () => {
  const props: PropTypesOf<typeof Flex> = {
    wrap: true,
  };
  const renderer = TestRenderer.create(
    <Flex {...props}>
      <div>Hello World</div>
    </Flex>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders with wrap reverse", () => {
  const props: PropTypesOf<typeof Flex> = {
    wrap: "reverse",
  };
  const renderer = TestRenderer.create(
    <Flex {...props}>
      <div>Hello World</div>
    </Flex>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders with item gutter", () => {
  const props: PropTypesOf<typeof Flex> = {
    itemGutter: true,
  };
  const renderer = TestRenderer.create(
    <Flex {...props}>
      <div>Hello World</div>
    </Flex>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders with half item gutter", () => {
  const props: PropTypesOf<typeof Flex> = {
    itemGutter: "half",
  };
  const renderer = TestRenderer.create(
    <Flex {...props}>
      <div>Hello World</div>
    </Flex>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
