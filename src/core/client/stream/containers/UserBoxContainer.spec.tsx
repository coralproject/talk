import { shallow } from "enzyme";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import { UserBoxContainer } from "./UserBoxContainer";

// Remove relay refs so we can stub the props.
const UserBoxContainerN = removeFragmentRefs(UserBoxContainer);

it("renders correctly", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
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
  const wrapper = shallow(<UserBoxContainerN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
