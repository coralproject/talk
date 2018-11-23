import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import OIDCButton from "./OIDCButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof OIDCButton> = {
    onClick: noop,
    children: "Login with OIDC",
  };
  const wrapper = shallow(<OIDCButton {...props} />);
  expect(wrapper).toMatchSnapshot();
});
