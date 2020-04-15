import { mount } from "enzyme";
import React from "react";
import simulant from "simulant";
import sinon from "sinon";

import UIContext from "../UIContext";
import {
  ClickFarAwayCallback,
  ClickFarAwayRegister,
  ClickOutside,
  default as ClickOutsideWithContext,
} from "./ClickOutside";

let container: HTMLElement;

beforeAll(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterAll(() => {
  document.body.removeChild(container);
});

it("should render correctly", () => {
  const noop = () => null;
  const wrapper = mount(
    <ClickOutside onClickOutside={noop}>
      <span>Hello World!</span>
    </ClickOutside>
  );
  expect(wrapper.html()).toMatchSnapshot();
  wrapper.unmount();
});

it("should detect click outside", () => {
  const onClickOutside = sinon.spy();
  const wrapper = mount(
    <ClickOutside onClickOutside={onClickOutside}>
      <span>Hello World!</span>
    </ClickOutside>,
    {
      attachTo: container,
    }
  );
  simulant.fire(container, "click");

  expect(onClickOutside.calledOnce).toEqual(true);
  wrapper.unmount();
});

it("should ignore click inside", () => {
  const onClickOutside = sinon.spy();
  const wrapper = mount(
    <ClickOutside onClickOutside={onClickOutside}>
      <button id="click-outside-test-button">Push Me</button>
    </ClickOutside>,
    {
      attachTo: container,
    }
  );

  const target = document.getElementById("click-outside-test-button")!;
  simulant.fire(target, "click");

  expect(onClickOutside.calledOnce).toEqual(false);
  wrapper.unmount();
});

it("should detect click far away", () => {
  let emitFarAwayClick: ClickFarAwayCallback = Function;
  const unlisten = sinon.spy();
  const registerClickFarAway: ClickFarAwayRegister = (cb) => {
    emitFarAwayClick = cb;
    return unlisten;
  };
  const onClickOutside = sinon.spy();
  const wrapper = mount(
    <ClickOutside
      onClickOutside={onClickOutside}
      registerClickFarAway={registerClickFarAway}
    >
      <button id="click-outside-test-button">Push Me</button>
    </ClickOutside>,
    {
      attachTo: container,
    }
  );

  expect(onClickOutside.calledOnce).toEqual(false);
  emitFarAwayClick();
  expect(onClickOutside.calledOnce).toEqual(true);
  expect(unlisten.calledOnce).toEqual(false);
  wrapper.unmount();
  expect(unlisten.calledOnce).toEqual(true);
});

it("should get registerClickFarAway from context", () => {
  const registerClickFarAway: ClickFarAwayRegister = sinon.spy();
  const onClickOutside = sinon.spy();
  const context: any = {
    registerClickFarAway,
  };
  const wrapper = mount(
    <UIContext.Provider value={context}>
      <ClickOutsideWithContext
        onClickOutside={onClickOutside}
        registerClickFarAway={registerClickFarAway}
      >
        <button id="click-outside-test-button">Push Me</button>
      </ClickOutsideWithContext>
    </UIContext.Provider>,
    {
      attachTo: container,
    }
  );

  expect(wrapper.find(ClickOutside).prop("registerClickFarAway")).toEqual(
    registerClickFarAway
  );
  wrapper.unmount();
});
