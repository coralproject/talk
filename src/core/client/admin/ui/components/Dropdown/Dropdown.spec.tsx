import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Button from "./Button";
import Divider from "./Divider";
import Dropdown from "./Dropdown";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Dropdown> = {
    children: (
      <>
        <Button blankAdornment>Shortcuts</Button>
        <Button
          href="https://github.com/coralproject/talk/issues/new"
          target="_blank"
        >
          Report Bug
        </Button>
        <Divider />
        <Button blankAdornment>Sign Out</Button>
      </>
    ),
    className: "custom",
  };
  const renderer = createRenderer();
  renderer.render(<Dropdown {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
