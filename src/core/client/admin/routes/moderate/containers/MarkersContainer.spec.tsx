import { shallow } from "enzyme";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import { MarkersContainer } from "./MarkersContainer";

const MarkersContainerN = removeFragmentRefs(MarkersContainer);

it("renders all markers", () => {
  const props: PropTypesOf<typeof MarkersContainerN> = {
    comment: {
      status: "PREMOD",
      actionCounts: {
        flag: {
          reasons: {
            COMMENT_DETECTED_TOXIC: 1,
            COMMENT_DETECTED_SPAM: 1,
            COMMENT_DETECTED_BODY_COUNT: 1,
            COMMENT_DETECTED_TRUST: 1,
            COMMENT_DETECTED_LINKS: 1,
            COMMENT_DETECTED_BANNED_WORD: 1,
            COMMENT_DETECTED_SUSPECT_WORD: 1,
            COMMENT_REPORTED_OFFENSIVE: 2,
            COMMENT_REPORTED_SPAM: 3,
          },
        },
      },
    },
  };
  const wrapper = shallow(<MarkersContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders some markers", () => {
  const props: PropTypesOf<typeof MarkersContainerN> = {
    comment: {
      status: "PREMOD",
      actionCounts: {
        flag: {
          reasons: {
            COMMENT_DETECTED_TOXIC: 1,
            COMMENT_DETECTED_SPAM: 0,
            COMMENT_DETECTED_BODY_COUNT: 1,
            COMMENT_DETECTED_TRUST: 1,
            COMMENT_DETECTED_LINKS: 0,
            COMMENT_DETECTED_BANNED_WORD: 1,
            COMMENT_DETECTED_SUSPECT_WORD: 0,
            COMMENT_REPORTED_OFFENSIVE: 2,
            COMMENT_REPORTED_SPAM: 0,
          },
        },
      },
    },
  };
  const wrapper = shallow(<MarkersContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
