import { shallow } from "enzyme";
import React from "react";

import PermalinkViewContainer from "talk-stream/containers/PermalinkViewContainer";
import AppContainer from "../containers/AppContainer";
import { renderWrapper } from "./AppQuery";

it("renders permalink view", () => {
  const data = {
    props: {} as any,
    error: null,
  };
  const component = renderWrapper(PermalinkViewContainer);
  const wrapper = shallow(React.createElement(() => component(data)));
  expect(wrapper).toMatchSnapshot();
});

it("renders app", () => {
  const data = {
    props: {} as any,
    error: null,
  };
  const component = renderWrapper(AppContainer);
  const wrapper = shallow(React.createElement(() => component(data)));
  expect(wrapper).toMatchSnapshot();
});

it("renders loading", () => {
  const data = {
    props: null,
    error: null,
  };
  const component = renderWrapper(AppContainer);
  const wrapper = shallow(React.createElement(() => component(data)));
  expect(wrapper).toMatchSnapshot();
});

it("renders error", () => {
  const data = {
    props: null,
    error: new Error("error"),
  };
  const component = renderWrapper(AppContainer);
  const wrapper = shallow(React.createElement(() => component(data)));
  expect(wrapper).toMatchSnapshot();
});
