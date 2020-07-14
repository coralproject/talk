import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import OptGroup from "./OptGroup";

it("renders correctly", () => {
  const props: PropTypesOf<typeof OptGroup> = {
    label: "mamals",
    children: <span />,
  };
  const renderer = TestRenderer.create(<OptGroup {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
