import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import ModerateCard from "./ModerateCard";

const ModerateCardN = removeFragmentRefs(ModerateCard);

const baseProps: PropTypesOf<typeof ModerateCardN> = {
  username: "Theon",
  createdAt: "2018-11-29T16:01:51.897Z",
  body: "content",
  inReplyTo: null,
  comment: {},
  status: "undecided",
  viewContextHref: "http://localhost/comment",
  suspectWords: ["idiot"],
  bannedWords: ["fuck"],
  onAccept: noop,
  onReject: noop,
};

it("renders correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
  };
  const wrapper = shallow(<ModerateCardN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders reply correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    inReplyTo: "Julian",
  };
  const wrapper = shallow(<ModerateCardN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders accepted correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    status: "accepted",
  };
  const wrapper = shallow(<ModerateCardN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders rejected correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    status: "rejected",
  };
  const wrapper = shallow(<ModerateCardN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders dangling correctly", () => {
  const props: PropTypesOf<typeof ModerateCardN> = {
    ...baseProps,
    dangling: true,
  };
  const wrapper = shallow(<ModerateCardN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
