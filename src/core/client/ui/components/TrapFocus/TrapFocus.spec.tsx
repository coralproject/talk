import React from "react";
import { create } from "react-test-renderer";
import Sinon from "sinon";

import { PropTypesOf } from "talk-ui/types";
import TrapFocus from "./TrapFocus";

it("renders correctly", () => {
  const props: PropTypesOf<TrapFocus> = {
    firstFocusable: null,
    lastFocusable: null,
    children: (
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
  const fakeHTMLElementBegin = { focus: Sinon.spy() };
  const fakeHTMLElementEnd = { focus: Sinon.spy() };
  const props: PropTypesOf<TrapFocus> = {
    firstFocusable: fakeHTMLElementBegin as any,
    lastFocusable: fakeHTMLElementEnd as any,
    children: (
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
  renderer.root.findAllByProps({ tabIndex: 0 })[0].props.onFocus();
  expect(fakeHTMLElementBegin.focus.called).toBe(false);
  expect(fakeHTMLElementEnd.focus.called).toBe(true);
});

it("Change focus to `firstFocusable` when focus reaches the end", () => {
  const fakeHTMLElementBegin = { focus: Sinon.spy() };
  const fakeHTMLElementEnd = { focus: Sinon.spy() };
  const props: PropTypesOf<TrapFocus> = {
    firstFocusable: fakeHTMLElementBegin as any,
    lastFocusable: fakeHTMLElementEnd as any,
    children: (
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
  renderer.root.findAllByProps({ tabIndex: 0 })[1].props.onFocus();
  expect(fakeHTMLElementBegin.focus.called).toBe(true);
  expect(fakeHTMLElementEnd.focus.called).toBe(false);
});
