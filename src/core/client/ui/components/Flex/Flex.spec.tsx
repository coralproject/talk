import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-ui/types";

import Flex from "./Flex";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Flex> = {
    justifyContent: "center",
    alignItems: "center",
    direction: "row",
  };
  const wrapper = shallow(
    <Flex {...props}>
      <div>Hello World</div>
    </Flex>
  );
  expect(wrapper).toMatchSnapshot();
});
