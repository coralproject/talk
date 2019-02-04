import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import ListItem from "./ListItem";
import UnorderedList from "./UnorderedList";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(
    <UnorderedList>
      <ListItem icon={<span>-</span>}>1</ListItem>
      <ListItem>2</ListItem>
    </UnorderedList>
  );
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
