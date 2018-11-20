import { shallow } from "enzyme";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import Profile from "./Profile";

const ProfileN = removeFragmentRefs(Profile);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ProfileN> = {
    story: {},
    me: {},
    settings: {},
  };
  const wrapper = shallow(<ProfileN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
