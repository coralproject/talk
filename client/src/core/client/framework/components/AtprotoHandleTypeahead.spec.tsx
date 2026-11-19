import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { Field, Form } from "react-final-form";
import sinon from "sinon";

import { CoralReactContext } from "coral-framework/lib/bootstrap/CoralContext";

import AtprotoHandleTypeahead from "./AtprotoHandleTypeahead";

const HANDLE = "alice.bsky.social";

/**
 * FakeTypeahead stands in for the actor-typeahead element. Like it, picking a
 * suggestion focuses the input, then sets the input's value, and Enter is
 * always cancelled, picking the highlighted suggestion if there is one.
 */
class FakeTypeahead extends HTMLElement {
  public connectedCallback() {
    this.addEventListener("pointerup", () => this.pick());
    this.addEventListener("keydown", (evt) => {
      if (evt.key !== "Enter") {
        return;
      }
      evt.preventDefault();
      if (this.getAttribute("data-highlighted") === "true") {
        this.pick();
      }
    });
  }

  private pick() {
    const input = this.querySelector("input")!;
    input.focus();
    input.value = HANDLE;
  }
}

beforeAll(() => {
  if (!window.customElements.get("actor-typeahead")) {
    window.customElements.define("actor-typeahead", FakeTypeahead);
  }
});

// Let React render the updates the events scheduled.
const settle = () => act(() => new Promise((resolve) => setTimeout(resolve)));

function renderForm() {
  const onSubmit = sinon.stub();
  const result = render(
    <CoralReactContext.Provider value={{ window } as any}>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit}>
            <Field name="handle">
              {({ input }) => (
                <AtprotoHandleTypeahead
                  host="https://typeahead.example"
                  value={input.value}
                  onChange={(handle) => form.change("handle", handle)}
                  onSubmit={() => void form.submit()}
                >
                  <input {...input} aria-label="handle" />
                </AtprotoHandleTypeahead>
              )}
            </Field>
            <button type="submit">Sign in</button>
          </form>
        )}
      </Form>
    </CoralReactContext.Provider>
  );

  const input = result.getByLabelText("handle") as HTMLInputElement;
  const element = result.container.querySelector("actor-typeahead")!;
  const submit = result.getByText("Sign in");

  return { onSubmit, input, element, submit };
}

it("puts a handle picked with the pointer in the form", async () => {
  const { onSubmit, input, element, submit } = renderForm();

  fireEvent.change(input, { target: { value: "ali" } });
  await settle();

  act(() => {
    element.dispatchEvent(new Event("pointerup", { bubbles: true }));
  });
  await settle();

  expect(input.value).toBe(HANDLE);

  fireEvent.click(submit);
  await settle();
  expect(onSubmit.calledOnce).toBe(true);
  expect(onSubmit.firstCall.args[0]).toEqual({ handle: HANDLE });
});

it("puts a handle picked with Enter in the form without submitting", async () => {
  const { onSubmit, input, element } = renderForm();
  element.setAttribute("data-highlighted", "true");

  fireEvent.change(input, { target: { value: "ali" } });
  await settle();

  fireEvent.keyDown(input, { key: "Enter" });
  await settle();

  expect(input.value).toBe(HANDLE);
  expect(onSubmit.called).toBe(false);
});

it("submits the typed handle on Enter when none is picked", async () => {
  const { onSubmit, input } = renderForm();

  fireEvent.change(input, { target: { value: "bob.example.com" } });
  await settle();

  fireEvent.keyDown(input, { key: "Enter" });
  await settle();

  expect(onSubmit.calledOnce).toBe(true);
  expect(onSubmit.firstCall.args[0]).toEqual({ handle: "bob.example.com" });
});
