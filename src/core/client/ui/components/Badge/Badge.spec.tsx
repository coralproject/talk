import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-ui/types";

import Badge from "./Badge";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Badge> = {
    className: "custom",
    children: "Spam",
  };
  const renderer = TestRenderer.create(<Badge {...props}>Staff</Badge>);
  expect(renderer.toJSON()).toMatchSnapshot();
});
