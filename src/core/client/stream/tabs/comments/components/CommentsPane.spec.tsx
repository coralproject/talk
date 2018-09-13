import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import CommentsPane from "./CommentsPane";

it("renders stream", () => {
  const props: PropTypesOf<typeof CommentsPane> = {
    showPermalinkView: false,
  };
  const wrapper = shallow(<CommentsPane {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders permalink view", () => {
  const props: PropTypesOf<typeof CommentsPane> = {
    showPermalinkView: true,
  };
  const wrapper = shallow(<CommentsPane {...props} />);
  expect(wrapper).toMatchSnapshot();
});
