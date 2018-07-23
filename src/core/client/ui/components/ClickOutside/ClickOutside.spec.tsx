import { mount } from "enzyme";
import React from "react";
import simulant from "simulant";
import sinon from "sinon";

import Button from "../Button/Button";
import ClickOutside from "./ClickOutside";

let container: HTMLElement;

beforeAll(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterAll(() => {
  document.body.removeChild(container);
});

it("should detect click outside", () => {
  const onClickOutside = sinon.spy();
  const wrapper = mount(
    <ClickOutside onClickOutside={onClickOutside}>
      <Button variant="filled">Push Me</Button>
    </ClickOutside>,
    {
      attachTo: container,
    }
  );
  simulant.fire(container, "click");

  expect(onClickOutside.calledOnce).toEqual(true);
  expect(wrapper).toMatchSnapshot();
  wrapper.unmount();
});

it("should ignore click inside", () => {
  const onClickOutside = sinon.spy();
  const wrapper = mount(
    <ClickOutside onClickOutside={onClickOutside}>
      <Button id="click-outside-test-button" variant="filled">
        Push Me
      </Button>
    </ClickOutside>,
    {
      attachTo: container,
    }
  );
  simulant.fire(document.getElementById("click-outside-test-button")!, "click");

  expect(onClickOutside.calledOnce).toEqual(false);
  expect(wrapper).toMatchSnapshot();
  wrapper.unmount();
});
