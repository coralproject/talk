import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { TOXICITY_THRESHOLD_DEFAULT } from "coral-common/constants";
import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import { MarkersContainer } from "./MarkersContainer";

const MarkersContainerN = removeFragmentRefs(MarkersContainer);

it("renders all markers", () => {
  const props: PropTypesOf<typeof MarkersContainerN> = {
    comment: {
      status: "PREMOD",
      revision: {
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_DETECTED_TOXIC: 1,
              COMMENT_DETECTED_SPAM: 1,
              COMMENT_DETECTED_RECENT_HISTORY: 1,
              COMMENT_DETECTED_LINKS: 1,
              COMMENT_DETECTED_BANNED_WORD: 1,
              COMMENT_DETECTED_SUSPECT_WORD: 1,
              COMMENT_REPORTED_OFFENSIVE: 2,
              COMMENT_REPORTED_SPAM: 3,
            },
          },
        },
        metadata: {
          perspective: {
            score: 0,
          },
        },
      },
    },
    settings: {
      integrations: {
        perspective: {
          threshold: TOXICITY_THRESHOLD_DEFAULT / 100,
        },
      },
    },
    onUsernameClick: () => null,
  };
  const renderer = createRenderer();
  renderer.render(<MarkersContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders some markers", () => {
  const props: PropTypesOf<typeof MarkersContainerN> = {
    comment: {
      status: "PREMOD",
      revision: {
        actionCounts: {
          flag: {
            reasons: {
              COMMENT_DETECTED_TOXIC: 1,
              COMMENT_DETECTED_SPAM: 0,
              COMMENT_DETECTED_RECENT_HISTORY: 1,
              COMMENT_DETECTED_LINKS: 0,
              COMMENT_DETECTED_BANNED_WORD: 1,
              COMMENT_DETECTED_SUSPECT_WORD: 0,
              COMMENT_REPORTED_OFFENSIVE: 2,
              COMMENT_REPORTED_SPAM: 0,
            },
          },
        },
        metadata: {
          perspective: {
            score: 1,
          },
        },
      },
    },
    settings: {
      integrations: {
        perspective: {
          threshold: TOXICITY_THRESHOLD_DEFAULT / 100,
        },
      },
    },
    onUsernameClick: () => null,
  };
  const renderer = createRenderer();
  renderer.render(<MarkersContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
