import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Configure from "./Configure";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Configure> = {
    onSubmit: noop,
    onChange: noop,
    children: <span />,
  };
  const renderer = createRenderer();
  renderer.render(<Configure {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
