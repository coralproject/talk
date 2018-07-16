import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import { AppContainer } from "./AppContainer";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AppContainer> = {
    data: {
      asset: {},
    },
  };
  const wrapper = shallow(<AppContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});
