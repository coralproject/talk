import { shallow } from "enzyme";
import React from "react";

import { PropTypesOf } from "talk-framework/types";

import { UserBoxContainer } from "./UserBoxContainer";

it("renders correctly", () => {
  const props: PropTypesOf<UserBoxContainer> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
    },
    user: null,
    // tslint:disable-next-line:no-empty
    showAuthPopup: async () => {},
    // tslint:disable-next-line:no-empty
    setAuthPopupState: async () => {},
    // tslint:disable-next-line:no-empty
    signOut: async () => {},
  };
  const wrapper = shallow(<UserBoxContainer {...props} />);
  expect(wrapper).toMatchSnapshot();
});
