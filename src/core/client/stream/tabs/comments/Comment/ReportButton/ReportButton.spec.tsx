import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ReportButton from "./ReportButton";

it("renders report button", () => {
  const props: PropTypesOf<typeof ReportButton> = {
    reported: false,
  };
  const renderer = createRenderer();
  renderer.render(<ReportButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders reported button", () => {
  const props: PropTypesOf<typeof ReportButton> = {
    reported: true,
  };
  const renderer = createRenderer();
  renderer.render(<ReportButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
