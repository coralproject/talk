import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";
import sinon from "sinon";

import { pureMerge, timeout } from "coral-common/utils";
import { createPromisifiedStorage } from "coral-framework/lib/storage";
import { removeFragmentRefs, wait } from "coral-framework/testHelpers";
import { DeepPartial, PropTypesOf } from "coral-framework/types";

import { ReplyCommentFormContainer } from "./ReplyCommentFormContainer";

const ReplyCommentFormContainerN = removeFragmentRefs(
  ReplyCommentFormContainer
);

function getContextKey(commentID: string) {
  return `replyCommentFormBody-${commentID}`;
}

type Props = PropTypesOf<typeof ReplyCommentFormContainerN>;

function createDefaultProps(add: DeepPartial<Props> = {}): Props {
  return pureMerge(
    {
      createCommentReply: noop as any,
      refreshSettings: noop as any,
      onClose: noop as any,
      story: {
        id: "story-id",
        isClosed: false,
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
        closeCommenting: {
          message: "closed",
        },
        disableCommenting: {
          enabled: false,
          message: "",
        },
        rte: {},
      },
    },
    add
  );
}

it("renders correctly", async () => {
  const props = createDefaultProps();

  const renderer = createRenderer();
  renderer.render(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders with initialValues", async () => {
  const props = createDefaultProps();

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
  const props = createDefaultProps();

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
  const input = { body: "Hello World!" };
  const createCommentStub = sinon.stub().returns({ edge: { node: {} } });
  const form = { reset: noop };
  const onCloseStub = sinon.stub();

  const props = createDefaultProps({
    onClose: onCloseStub,
    createCommentReply: createCommentStub,
  });

  await props.sessionStorage.setItem(
    getContextKey(props.comment.id),
    "Hello World!"
  );

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper.first().props().onSubmit(input, form);
  expect(
    createCommentStub.calledWith({
      storyID,
      parentID: props.comment.id,
      parentRevisionID: "revision-id",
      nudge: true,
      local: undefined,
      ...input,
    })
  ).toBeTruthy();
  await timeout();
  expect(onCloseStub.calledOnce).toBe(true);
});

it("closes on cancel", async () => {
  const onCloseStub = sinon.stub();
  const props = createDefaultProps({
    onClose: onCloseStub,
  });

  await props.sessionStorage.setItem(
    getContextKey(props.comment.id),
    "Hello World!"
  );

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper.findWhere((w) => !!w.prop("onCancel")).prop("onCancel")();

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

  const props = createDefaultProps({
    autofocus: true,
  });

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .findWhere((n) => n.prop("rteRef"))
    .props()
    .rteRef(rte);
  await wait(() => expect(focusStub.calledOnce).toBe(true));
});

it("renders when story has been closed", async () => {
  const props = createDefaultProps({
    story: {
      isClosed: true,
    },
    settings: {
      closeCommenting: {
        message: "story closed",
      },
    },
  });

  const renderer = createRenderer();
  renderer.render(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders when commenting has been disabled", async () => {
  const props = createDefaultProps({
    settings: {
      disableCommenting: {
        enabled: true,
        message: "commenting disabled",
      },
    },
  });
  const renderer = createRenderer();
  renderer.render(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
