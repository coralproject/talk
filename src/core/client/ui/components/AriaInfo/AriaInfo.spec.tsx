import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-framework/types";

import AriaInfo from "./AriaInfo";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AriaInfo> = {
    children: "This text is only for screen readers",
  };
  const renderer = TestRenderer.create(<AriaInfo {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
