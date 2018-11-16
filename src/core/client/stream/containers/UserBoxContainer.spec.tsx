import { shallow } from "enzyme";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import { UserBoxContainer } from "./UserBoxContainer";

// Remove relay refs so we can stub the props.
const UserBoxContainerN = removeFragmentRefs(UserBoxContainer);

it("renders fully", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      authJTI: "JTI",
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: true,
          },
          google: {
            enabled: false,
          },
          sso: {
            enabled: false,
          },
          local: {
            enabled: true,
          },
          oidc: [],
        },
      },
    },
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

it("renders without logout button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      authJTI: null,
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: true,
          },
          google: {
            enabled: false,
          },
          sso: {
            enabled: false,
          },
          local: {
            enabled: true,
          },
          oidc: [],
        },
      },
    },
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

it("renders sso only", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      authJTI: "JTI",
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: false,
          },
          google: {
            enabled: false,
          },
          sso: {
            enabled: true,
          },
          local: {
            enabled: false,
          },
          oidc: [],
        },
      },
    },
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

it("renders sso only without logut button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      authJTI: "JTI",
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: false,
          },
          google: {
            enabled: false,
          },
          sso: {
            enabled: true,
          },
          local: {
            enabled: false,
          },
          oidc: [],
        },
      },
    },
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
