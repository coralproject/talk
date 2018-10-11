import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

it("renders sign in", () => {
  const props: PropTypesOf<typeof App> = {
    data: {
      organizationName: "",
      organizationContactEmail: "",
      organizationURL: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      domains: [],
    },
    onSaveData: (newData: {}) => new Promise(resolve => resolve(props.data)),
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});
