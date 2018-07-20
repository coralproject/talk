import React from "react";
import { create } from "react-test-renderer";
import Sinon from "sinon";

import { PropTypesOf } from "talk-ui/types";
import TrapFocus from "./TrapFocus";

const FakeFocusable: any = class extends React.Component {
  public focus = Sinon.spy();
  public render() {
    return null;
  }
};

it("renders correctly", () => {
  const props: PropTypesOf<TrapFocus> = {
    children: () => (
      <>
        <span>child1</span>
        <span>child2</span>
      </>
    ),
  };
  const renderer = create(
    <div>
      <TrapFocus {...props} />
    </div>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
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
  const renderer = create(
    <div>
      <TrapFocus {...props} />
    </div>
  );
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
  const renderer = create(
    <div>
      <TrapFocus {...props} />
    </div>
  );
  renderer.root.findAllByProps({ tabIndex: 0 })[1].props.onFocus();
  expect(
    renderer.root.findAllByType(FakeFocusable)[0].instance.focus.called
  ).toBe(true);
  expect(
    renderer.root.findAllByType(FakeFocusable)[1].instance.focus.called
  ).toBe(false);
});
