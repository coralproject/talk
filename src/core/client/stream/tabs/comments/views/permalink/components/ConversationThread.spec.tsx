import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { pureMerge } from "talk-common/utils";
import { removeFragmentRefs } from "talk-framework/testHelpers";
import { DeepPartial, PropTypesOf } from "talk-framework/types";

import ConversationThread from "./ConversationThread";

const ConversationThreadN = removeFragmentRefs(ConversationThread);

type Props = PropTypesOf<typeof ConversationThreadN>;

function createDefaultProps(add: DeepPartial<Props> = {}): Props {
  return pureMerge(
    {
      className: "root",
      viewer: {},
      story: {},
      settings: {},
      comment: {},
      disableLoadMore: false,
      loadMore: noop,
      remaining: 2,
      parents: [],
      rootParent: {
        id: "root-parent",
        createdAt: "1995-12-17T03:24:00.000Z",
        username: "parentAuthor",
        tags: [],
      },
    },
    add
  );
}

describe("with 2 remaining parent comments", () => {
  it("renders correctly", () => {
    const props = createDefaultProps();
    const renderer = createRenderer();
    renderer.render(<ConversationThreadN {...props} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders staff badge", () => {
    const props = createDefaultProps({
      rootParent: {
        tags: ["Staff"],
      },
    });
    const renderer = createRenderer();
    renderer.render(<ConversationThreadN {...props} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders with disabled load more", () => {
    const props = createDefaultProps({
      disableLoadMore: true,
    });
    const renderer = createRenderer();
    renderer.render(<ConversationThreadN {...props} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

it("renders with no parent comments", () => {
  const props = createDefaultProps({
    remaining: 0,
    rootParent: null,
  });
  const renderer = createRenderer();
  renderer.render(<ConversationThreadN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
