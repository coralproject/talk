import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";
import { ReplyCommentFormContainer } from "./ReplyCommentFormContainer";

const ReplyCommentFormContainerN = removeFragmentRefs(
  ReplyCommentFormContainer
);

function getContextKey(commentID: string) {
  return `replyCommentFormBody-${commentID}`;
}

function createDefaultProps(): PropTypesOf<typeof ReplyCommentFormContainerN> {
  return {
    createCommentReply: noop as any,
    refreshSettings: noop as any,
    story: {
      id: "story-id",
    },
    comment: {
      id: "comment-id",
      author: {
        username: "Joe",
      },
      revision: {
        id: "revision-id",
      },
    },
    sessionStorage: createPromisifiedStorage(),
    autofocus: false,
    settings: {
      charCount: {
        enabled: true,
        min: 3,
        max: 100,
      },
    },
  };
}

it("renders correctly", async () => {
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    ...createDefaultProps(),
  };

  const renderer = createRenderer();
  renderer.render(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders with initialValues", async () => {
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    ...createDefaultProps(),
  };

  await props.sessionStorage.setItem(
    getContextKey(props.comment.id),
    "Hello World!"
  );

  const renderer = createRenderer();
  renderer.render(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("save values", async () => {
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    ...createDefaultProps(),
  };

  await props.sessionStorage.setItem(
    getContextKey(props.comment.id),
    "Hello World!"
  );

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .first()
    .props()
    .onChange({ values: { body: "changed" } });
  expect(
    await props.sessionStorage.getItem(getContextKey(props.comment.id))
  ).toBe("changed");
});

it("creates a comment", async () => {
  const storyID = "story-id";
  const input = { body: "Hello World!", local: false };
  const createCommentStub = sinon.stub();
  const form = { reset: noop };
  const onCloseStub = sinon.stub();

  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    ...createDefaultProps(),
    onClose: onCloseStub,
    createCommentReply: createCommentStub,
  };

  await props.sessionStorage.setItem(
    getContextKey(props.comment.id),
    "Hello World!"
  );

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .first()
    .props()
    .onSubmit(input, form);
  expect(
    createCommentStub.calledWith({
      storyID,
      parentID: props.comment.id,
      parentRevisionID: "revision-id",
      ...input,
    })
  ).toBeTruthy();
  await timeout();
  expect(onCloseStub.calledOnce).toBe(true);
});

it("closes on cancel", async () => {
  const onCloseStub = sinon.stub();
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    ...createDefaultProps(),
    onClose: onCloseStub,
  };

  await props.sessionStorage.setItem(
    getContextKey(props.comment.id),
    "Hello World!"
  );

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper.findWhere(w => !!w.prop("onCancel")).prop("onCancel")();

  // Calls close.
  expect(onCloseStub.calledOnce).toBe(true);

  // Removes saved value.
  expect(
    await props.sessionStorage.getItem(getContextKey(props.comment.id))
  ).toBeNull();
});

it("autofocuses", async () => {
  const focusStub = sinon.stub();
  const rte = { focus: focusStub };
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    ...createDefaultProps(),
    autofocus: true,
  };

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .findWhere(n => n.prop("rteRef"))
    .props()
    .rteRef(rte);
  expect(focusStub.calledOnce).toBe(true);
});
