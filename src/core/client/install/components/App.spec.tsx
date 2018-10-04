import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import App from "./App";

it("renders sign in", () => {
  const props: PropTypesOf<typeof App> = {
    saveData: () => {
      //
    },
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
  };
  const wrapper = shallow(<App {...props} />);
  expect(wrapper).toMatchSnapshot();
});
