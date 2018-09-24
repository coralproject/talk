import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
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

it("renders correctly", async () => {
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    createComment: noop as any,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
    },
    sessionStorage: createPromisifiedStorage(),
    autofocus: false,
  };

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("renders with initialValues", async () => {
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    createComment: noop as any,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
    },
    sessionStorage: createPromisifiedStorage(),
    autofocus: false,
  };

  await props.sessionStorage.setItem(
    getContextKey(props.comment.id),
    "Hello World!"
  );

  const wrapper = shallow(<ReplyCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("save values", async () => {
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    createComment: noop as any,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
    },
    sessionStorage: createPromisifiedStorage(),
    autofocus: false,
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
  const assetID = "asset-id";
  const input = { body: "Hello World!", local: false };
  const createCommentStub = sinon.stub();
  const form = { reset: noop };
  const onCloseStub = sinon.stub();

  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    createComment: createCommentStub,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
    },
    sessionStorage: createPromisifiedStorage(),
    onClose: onCloseStub,
    autofocus: false,
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
      assetID,
      parentID: props.comment.id,
      ...input,
    })
  ).toBeTruthy();
  await timeout();
  expect(onCloseStub.calledOnce).toBe(true);
});

it("closes on cancel", async () => {
  const onCloseStub = sinon.stub();
  const props: PropTypesOf<typeof ReplyCommentFormContainerN> = {
    createComment: noop as any,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
    },
    sessionStorage: createPromisifiedStorage(),
    onClose: onCloseStub,
    autofocus: false,
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
    createComment: noop as any,
    asset: {
      id: "asset-id",
    },
    comment: {
      id: "comment-id",
    },
    sessionStorage: createPromisifiedStorage(),
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
