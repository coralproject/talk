import { noop } from "lodash";
import React from "react";
import TestRenderer, { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { act } from "coral-framework/testHelpers";

import UIContext, { UIContextProps } from "../UIContext";
import Modal from "./Modal";

const context: UIContextProps = {
  renderWindow: window,
};

const createNodeMock = () => ({
  focus: noop,
});

it("renders correctly", () => {
  expect(document.body.lastChild).toBeNull();
  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <UIContext.Provider value={context}>
        <Modal>
          <div>Test</div>
        </Modal>
      </UIContext.Provider>,
      { createNodeMock }
    );
  });
  expect(testRenderer!.toJSON()).toBeNull();
  expect(document.body.lastChild).toBeNull();
  act(() => {
    testRenderer.update(
      <UIContext.Provider value={context}>
        <Modal open>
          <div>Test</div>
        </Modal>
      </UIContext.Provider>
    );
  });
  expect(testRenderer!.toJSON()).toMatchSnapshot();
  act(() => {
    testRenderer.unmount();
  });
  expect(document.body.lastChild).toBeNull();
});

it("relays backdrop click events", () => {
  const event = {};
  const onBackdropClick = sinon.stub();
  const onClose = sinon.stub();
  expect(document.body.lastChild).toBeNull();
  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <UIContext.Provider value={context}>
        <Modal open onBackdropClick={onBackdropClick} onClose={onClose}>
          <div>Test</div>
        </Modal>
      </UIContext.Provider>,
      { createNodeMock }
    );
  });
  testRenderer!.root
    .findByProps({ "data-testid": "scroll" })
    .props.onClick(event);
  act(() => {
    testRenderer.unmount();
  });
  expect(onBackdropClick.called).toBe(true);
  expect(onClose.calledWith(event, "backdropClick")).toBe(true);
});

it("relays esc events", () => {
  const escEvent = { keyCode: 27 };
  const otherEvent = { keyCode: 100 };
  const onEscapeKeyDown = sinon.stub();
  const onClose = sinon.stub();
  expect(document.body.lastChild).toBeNull();
  let testRenderer: ReactTestRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <UIContext.Provider value={context}>
        <Modal open onEscapeKeyDown={onEscapeKeyDown} onClose={onClose}>
          <div>Test</div>
        </Modal>
      </UIContext.Provider>,
      { createNodeMock }
    );
  });
  const el = testRenderer!.root.find((i) => i.props.onKeyDown);
  el.props.onKeyDown(escEvent);
  el.props.onKeyDown(otherEvent);
  act(() => {
    testRenderer.unmount();
  });
  expect(onEscapeKeyDown.called).toBe(true);
  expect(onClose.calledWith(escEvent, "escapeKeyDown")).toBe(true);
  expect(onClose.calledWith(otherEvent, "escapeKeyDown")).toBe(false);
});
