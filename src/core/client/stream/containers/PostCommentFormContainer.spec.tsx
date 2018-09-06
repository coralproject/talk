import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon from "sinon";

import { PropTypesOf } from "talk-framework/types";

import { timeout } from "talk-common/utils";
import { createFakePymStorage } from "talk-framework/testHelpers";
import { PostCommentFormContainer } from "./PostCommentFormContainer";

const contextKey = "postCommentFormBody";

it("renders correctly", async () => {
  const props: PropTypesOf<typeof PostCommentFormContainer> = {
    // tslint:disable-next-line:no-empty
    createComment: (() => {}) as any,
    assetID: "asset-id",
    pymSessionStorage: createFakePymStorage(),
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
    assetID: "asset-id",
    pymSessionStorage: createFakePymStorage(),
  };

  await props.pymSessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainer {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("save values", async () => {
  const props: PropTypesOf<typeof PostCommentFormContainer> = {
    // tslint:disable-next-line:no-empty
    createComment: (() => {}) as any,
    assetID: "asset-id",
    pymSessionStorage: createFakePymStorage(),
  };

  await props.pymSessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainer {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .first()
    .props()
    .onChange({ values: { body: "changed" } });
  expect(await props.pymSessionStorage.getItem(contextKey)).toBe("changed");
});

it("creates a comment", async () => {
  const assetID = "asset-id";
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
    assetID,
    pymSessionStorage: createFakePymStorage(),
  };

  await props.pymSessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainer {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .first()
    .props()
    .onSubmit(input, form);
  expect(
    createCommentStub.calledWith({
      assetID,
      ...input,
    })
  ).toBeTruthy();
  await timeout();
  formMock.verify();
});
