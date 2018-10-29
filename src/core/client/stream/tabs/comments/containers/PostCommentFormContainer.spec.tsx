import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import { PropTypesOf } from "talk-framework/types";
import { PostCommentFormContainer } from "./PostCommentFormContainer";

const contextKey = "postCommentFormBody";

it("renders correctly", async () => {
  const props: PropTypesOf<typeof PostCommentFormContainer> = {
    // tslint:disable-next-line:no-empty
    createComment: (() => {}) as any,
    storyID: "story-id",
    sessionStorage: createPromisifiedStorage(),
  };

  const wrapper = shallow(<PostCommentFormContainer {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("renders with initialValues", async () => {
  const props: PropTypesOf<typeof PostCommentFormContainer> = {
    // tslint:disable-next-line:no-empty
    createComment: (() => {}) as any,
    storyID: "story-id",
    sessionStorage: createPromisifiedStorage(),
  };

  await props.sessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainer {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("save values", async () => {
  const props: PropTypesOf<typeof PostCommentFormContainer> = {
    // tslint:disable-next-line:no-empty
    createComment: (() => {}) as any,
    storyID: "story-id",
    sessionStorage: createPromisifiedStorage(),
  };

  await props.sessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainer {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .first()
    .props()
    .onChange({ values: { body: "changed" } });
  expect(await props.sessionStorage.getItem(contextKey)).toBe("changed");
});

it("creates a comment", async () => {
  const storyID = "story-id";
  const input = { body: "Hello World!" };
  const createCommentStub = sinon.stub();
  const form = { reset: noop };
  const formMock = sinon.mock(form);
  formMock
    .expects("reset")
    .withArgs({})
    .once();

  const props: PropTypesOf<typeof PostCommentFormContainer> = {
    // tslint:disable-next-line:no-empty
    createComment: createCommentStub,
    storyID,
    sessionStorage: createPromisifiedStorage(),
  };

  await props.sessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainer {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .first()
    .props()
    .onSubmit(input, form);
  expect(
    createCommentStub.calledWith({
      storyID,
      ...input,
    })
  ).toBeTruthy();
  await timeout();
  formMock.verify();
});
