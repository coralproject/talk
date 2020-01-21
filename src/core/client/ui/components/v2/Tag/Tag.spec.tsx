import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import Tag from "./Tag";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Tag> = {
    className: "custom",
    children: "Spam",
  };
  const renderer = TestRenderer.create(<Tag {...props}>Staff</Tag>);
  expect(renderer.toJSON()).toMatchSnapshot();
});
