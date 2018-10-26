import { shallow } from "enzyme";
import noop from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

it("renders comments", () => {
  const props: PropTypesOf<typeof App> = {
    activeTab: "COMMENTS",
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});
