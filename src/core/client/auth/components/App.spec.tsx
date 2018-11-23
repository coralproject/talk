import { shallow } from "enzyme";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import App from "./App";

const AppN = removeFragmentRefs(App);

it("renders sign in", () => {
  const props: PropTypesOf<typeof AppN> = {
    view: "SIGN_IN",
    auth: {},
  };
  const wrapper = shallow(<AppN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
