/* eslint-disable react/display-name */
import { noop } from "lodash";
import React from "react";
import { create } from "react-test-renderer";
import sinon from "sinon";

import { PropTypesOf } from "coral-ui/types";

import TrapFocus from "./TrapFocus";

const FakeFocusable: any = class FakeFocusable extends React.Component {
  public focus = sinon.spy();
  public render() {
    return null;
  }
};

const createNodeMock = () => ({
  focus: noop,
});

it("renders correctly", () => {
  const props: PropTypesOf<TrapFocus> = {
    children: (
      <>
        <span>child1</span>
        <span>child2</span>
      </>
    ),
  };
  const renderer = create(<TrapFocus {...props} />, { createNodeMock });
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("autofocus", () => {
  const autoFocus = sinon.stub();
  create(<TrapFocus />, {
    createNodeMock: el => ({
      focus: el.props.tabIndex === -1 ? autoFocus : noop,
    }),
  });
  expect(autoFocus.called).toBe(true);
});

it("return focus to last active element", () => {
  expect(document.activeElement).toBe(document.body);
  const bodyMock = sinon.mock(document.body);
  const testRenderer = create(<TrapFocus />, { createNodeMock });
  bodyMock.expects("focus");
  testRenderer.unmount();
  bodyMock.verify();
});

it("Change focus to `lastFocusable` when focus reaches beginning", () => {
  const props: PropTypesOf<TrapFocus> = {
    children: ({ firstFocusableRef, lastFocusableRef }) => (
      <>
        <FakeFocusable ref={firstFocusableRef} />
        <span>child1</span>
        <span>child2</span>
        <FakeFocusable ref={lastFocusableRef} />
      </>
    ),
  };
  const renderer = create(<TrapFocus {...props} />, { createNodeMock });
  renderer.root.findAllByProps({ tabIndex: 0 })[0].props.onFocus();
  expect(
    renderer.root.findAllByType(FakeFocusable)[0].instance.focus.called
  ).toBe(false);
  expect(
    renderer.root.findAllByType(FakeFocusable)[1].instance.focus.called
  ).toBe(true);
});

it("Change focus to `firstFocusable` when focus reaches end", () => {
  const props: PropTypesOf<TrapFocus> = {
    children: ({ firstFocusableRef, lastFocusableRef }) => (
      <>
        <FakeFocusable ref={firstFocusableRef} />
        <span>child1</span>
        <span>child2</span>
        <FakeFocusable ref={lastFocusableRef} />
      </>
    ),
  };
  const renderer = create(<TrapFocus {...props} />, { createNodeMock });
  renderer.root.findAllByProps({ tabIndex: 0 })[1].props.onFocus();
  expect(
    renderer.root.findAllByType(FakeFocusable)[0].instance.focus.called
  ).toBe(true);
  expect(
    renderer.root.findAllByType(FakeFocusable)[1].instance.focus.called
  ).toBe(false);
});
