import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import TextLink from "./TextLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof TextLink> = {
    className: "custom",
  };
  const renderer = TestRenderer.create(<TextLink {...props}>Hello</TextLink>);
  expect(renderer.toJSON()).toMatchSnapshot();
});
