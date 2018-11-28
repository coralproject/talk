import { shallow } from "enzyme";
import React from "react";

import ListItem from "./ListItem";
import UnorderedList from "./UnorderedList";

it("renders correctly", () => {
  const wrapper = shallow(
    <UnorderedList>
      <ListItem icon={<span>-</span>}>1</ListItem>
      <ListItem>2</ListItem>
    </UnorderedList>
  );
  expect(wrapper).toMatchSnapshot();
});
