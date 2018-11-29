import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import GoToCommentLink from "./GoToCommentLink";

it("renders correctly", () => {
  const props: PropTypesOf<typeof GoToCommentLink> = {
    href: "#",
    onClick: noop,
  };
  const wrapper = shallow(<GoToCommentLink {...props} />);
  expect(wrapper).toMatchSnapshot();
});
