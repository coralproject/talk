import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Configure from "./Configure";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Configure> = {
    onSave: noop,
    onChange: noop,
  };
  const renderer = createRenderer();
  renderer.render(<Configure {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
