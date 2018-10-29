import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import PermalinkView from "./PermalinkView";

const PermalinkViewN = removeFragmentRefs(PermalinkView);

it("renders correctly", () => {
  const props: PropTypesOf<typeof PermalinkViewN> = {
    me: {},
    story: {},
    settings: {},
    comment: {},
    showAllCommentsHref: "http://localhost/link",
    onShowAllComments: noop,
  };
  const wrapper = shallow(<PermalinkViewN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders comment not found", () => {
  const props: PropTypesOf<typeof PermalinkViewN> = {
    me: {},
    story: {},
    settings: {},
    comment: null,
    showAllCommentsHref: "http://localhost/link",
    onShowAllComments: noop,
  };
  const wrapper = shallow(<PermalinkViewN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
