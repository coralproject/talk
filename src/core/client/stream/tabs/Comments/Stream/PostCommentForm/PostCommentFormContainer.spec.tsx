import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon from "sinon";

import { pureMerge, timeout } from "coral-common/utils";
import { createPromisifiedStorage } from "coral-framework/lib/storage";
import { act, removeFragmentRefs, wait } from "coral-framework/testHelpers";
import { DeepPartial, PropTypesOf } from "coral-framework/types";

import { PostCommentFormContainer } from "./PostCommentFormContainer";

const contextKey = "postCommentFormBody";
const PostCommentFormContainerN = removeFragmentRefs(PostCommentFormContainer);

type Props = PropTypesOf<typeof PostCommentFormContainerN>;

function createDefaultProps(add: DeepPartial<Props> = {}): Props {
  return pureMerge(
    {
      showAuthPopup: noop as any,
      createComment: noop as any,
      refreshSettings: noop as any,
      tab: "",
      onChangeTab: noop as any,
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
      viewer: {
        id: "viewer-id",
        scheduledDeletionDate: undefined,
      },
    },
    add
  );
}

it("renders correctly", async () => {
  const props = createDefaultProps();
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);

  act(() => {
    wrapper.update();
  });

  await act(async () => {
    await wait(() => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

it("renders with initialValues", async () => {
  const props = createDefaultProps();
  await act(async () => {
    await props.sessionStorage.setItem(contextKey, "Hello World!");
  });
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);

  act(() => {
    wrapper.update();
  });

  await act(async () => {
    await wait(() => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

it("save values", async () => {
  const props = createDefaultProps();

  await props.sessionStorage.setItem(contextKey, "Hello World!");

  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();

  act(() => {
    wrapper.update();
  });
  act(() => {
    wrapper
      .first()
      .props()
      .onChange({ values: { body: "changed" } });
  });

  await act(async () => {
    await wait(async () =>
      expect(await props.sessionStorage.getItem(contextKey)).toBe("changed")
    );
  });
});

it("creates a comment", async () => {
  const storyID = "story-id";
  const input = { body: "Hello World!" };
  const createCommentStub = sinon.stub().returns({ edge: { node: {} } });
  const form = { initialize: noop };
  const formMock = sinon.mock(form);
  formMock
    .expects("initialize")
    .withArgs({})
    .once();

  const props = createDefaultProps({
    createComment: createCommentStub,
    story: {
      id: storyID,
      isClosed: false,
    },
    commentsOrderBy: "CREATED_AT_ASC",
  });

  await act(async () => {
    await props.sessionStorage.setItem(contextKey, "Hello World!");
  });

  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();

  act(() => {
    wrapper.update();
  });
  act(() => {
    wrapper
      .first()
      .props()
      .onSubmit(input, form);
  });

  await act(async () => {
    await wait(() =>
      expect(
        createCommentStub.calledWith({
          storyID,
          nudge: true,
          commentsOrderBy: "CREATED_AT_ASC",
          ...input,
        })
      ).toBeTruthy()
    );
  });
  await act(async () => {
    await wait(() => formMock.verify());
  });
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

  act(() => {
    wrapper.update();
  });

  await act(async () => {
    await wait(() => expect(wrapper).toMatchSnapshot());
  });
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

  act(() => {
    wrapper.update();
  });

  await act(async () => {
    await wait(() => expect(wrapper).toMatchSnapshot());
  });
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

  act(() => {
    wrapper.setProps(nextProps);
  });

  await act(async () => {
    await wait(() => expect(wrapper).toMatchSnapshot());
  });
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

  act(() => {
    wrapper.setProps(nextProps);
  });

  await act(async () => {
    await wait(() => expect(wrapper).toMatchSnapshot());
  });
});

it("renders when user is scheduled to be deleted", async () => {
  const props = createDefaultProps({
    viewer: {
      scheduledDeletionDate: new Date("2019-01-01").toISOString(),
    },
  });
  const wrapper = shallow(<PostCommentFormContainerN {...props} />);
  await timeout();

  await act(async () => {
    await wait(() => expect(wrapper).toMatchSnapshot());
  });
});
