import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-framework/types";

import FieldSet from "./FieldSet";

it("renders correctly", () => {
  const props: PropTypesOf<typeof FieldSet> = {
    children: "content",
  };
  const renderer = TestRenderer.create(<FieldSet {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
