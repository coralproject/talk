import { shallow } from "enzyme";
import React from "react";

import Flex from "./Flex";

it("renders correctly", () => {
  const props = {
    justifyContent: "center",
    alignItems: "center",
  };
  const wrapper = shallow(
    <Flex {...props}>
      <div>Hello World</div>
    </Flex>
  );
  expect(wrapper).toMatchSnapshot();
});
