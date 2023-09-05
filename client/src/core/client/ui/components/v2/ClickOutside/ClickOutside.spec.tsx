import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import sinon from "sinon";

import { ClickOutside } from "./ClickOutside";

it("should render correctly", () => {
  const noop = () => null;
  render(
    <ClickOutside onClickOutside={noop}>
      <span>Hello World!</span>
    </ClickOutside>
  );
  expect(screen.getByText("Hello World!"));
});

it("should detect click outside", () => {
  const onClickOutside = sinon.spy();
  render(
    <div data-testid="outside">
      <ClickOutside onClickOutside={onClickOutside}>
        <span>Hello World!</span>
      </ClickOutside>
    </div>
  );
  const outsideDiv = screen.getByTestId("outside");
  userEvent.click(outsideDiv);

  expect(onClickOutside.calledOnce).toEqual(true);
});

it("should ignore click inside", () => {
  const onClickOutside = sinon.spy();
  render(
    <ClickOutside onClickOutside={onClickOutside}>
      <button data-testid="click-outside-test-button">Push Me</button>
    </ClickOutside>
  );

  const insideButton = screen.getByTestId("click-outside-test-button");
  userEvent.click(insideButton);
  expect(onClickOutside.calledOnce).toEqual(false);
});
