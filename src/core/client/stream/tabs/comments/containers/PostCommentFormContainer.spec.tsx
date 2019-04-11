import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { pureMerge } from "talk-common/utils";
import { createPromisifiedStorage } from "talk-framework/lib/storage";
import { removeFragmentRefs } from "talk-framework/testHelpers";
import { DeepPartial, PropTypesOf } from "talk-framework/types";

import { PostCommentFormContainer } from "./PostCommentFormContainer";

const contextKey = "postCommentFormBody";
const PostCommentFormContainerN = removeFragmentRefs(PostCommentFormContainer);

type Props = PropTypesOf<typeof PostCommentFormContainerN>;

function createDefaultProps(add: DeepPartial<Props> = {}): Props {
  return pureMerge(
    {
      local: {
        loggedIn: true,
      },
      createComment: noop as any,
      refreshSettings: noop as any,
      story: {
        id: "story-id",
        isClosed: false,
        settings: {
          messageBox: {
            enabled: false,
          },
        },
      },
      sessionStorage: createPromisifiedStorage(),
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
      },
    },
    add
  );
}

it("renders correctly", async () => {
  const props = createDefaultProps();
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("renders with initialValues", async () => {
  const props = createDefaultProps();

  await props.sessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("save values", async () => {
  const props = createDefaultProps();

  await props.sessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
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
  const createCommentStub = sinon.stub().returns({ edge: { node: {} } });
  const form = { reset: noop };
  const formMock = sinon.mock(form);
  formMock
    .expects("reset")
    .withArgs({})
    .once();

  const props = createDefaultProps({
    createComment: createCommentStub,
    story: {
      id: storyID,
      isClosed: false,
    },
  });

  await props.sessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  wrapper
    .first()
    .props()
    .onSubmit(input, form);
  expect(
    createCommentStub.calledWith({
      storyID,
      nudge: true,
      ...input,
    })
  ).toBeTruthy();
  await timeout();
  formMock.verify();
});

it("renders when story has been closed (collapsing)", async () => {
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
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("renders when commenting has been disabled (collapsing)", async () => {
  const props = createDefaultProps({
    settings: {
      disableCommenting: {
        enabled: true,
        message: "commenting disabled",
      },
    },
  });
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();
  wrapper.update();
  expect(wrapper).toMatchSnapshot();
});

it("renders when story has been closed (non-collapsing)", async () => {
  const props = createDefaultProps({
    story: {
      isClosed: false,
    },
    settings: {
      closeCommenting: {
        message: "story closed",
      },
    },
  });
  const nextProps = createDefaultProps({
    story: {
      isClosed: true,
    },
    settings: {
      closeCommenting: {
        message: "story closed",
      },
    },
  });
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();
  wrapper.setProps(nextProps);
  expect(wrapper).toMatchSnapshot();
});

it("renders when commenting has been disabled (non-collapsing)", async () => {
  const props = createDefaultProps({
    settings: {
      disableCommenting: {
        enabled: false,
        message: "commenting disabled",
      },
    },
  });
  const nextProps = createDefaultProps({
    settings: {
      disableCommenting: {
        enabled: true,
        message: "commenting disabled",
      },
    },
  });
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();
  wrapper.setProps(nextProps);
  expect(wrapper).toMatchSnapshot();
});
