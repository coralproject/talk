import { mount } from "enzyme";
import React from "react";
import simulant from "simulant";
import sinon from "sinon";

import { ClickOutside } from "./ClickOutside";

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
