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
            allowRegistration: true,
          },
          google: {
            enabled: false,
            allowRegistration: true,
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
          },
          sso: {
            enabled: false,
            allowRegistration: true,
          },
          local: {
            enabled: true,
            allowRegistration: true,
          },
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
            allowRegistration: true,
          },
          google: {
            enabled: false,
            allowRegistration: true,
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
          },
          sso: {
            enabled: false,
            allowRegistration: true,
          },
          local: {
            enabled: true,
            allowRegistration: true,
          },
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
            allowRegistration: true,
          },
          google: {
            enabled: false,
            allowRegistration: true,
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
          },
          sso: {
            enabled: true,
            allowRegistration: true,
          },
          local: {
            enabled: false,
            allowRegistration: true,
          },
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

it("renders sso only without logout button", () => {
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
            allowRegistration: true,
          },
          google: {
            enabled: false,
            allowRegistration: true,
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
          },
          sso: {
            enabled: true,
            allowRegistration: true,
          },
          local: {
            enabled: false,
            allowRegistration: true,
          },
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

it("renders without register button", () => {
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
            allowRegistration: false,
          },
          google: {
            enabled: false,
            allowRegistration: false,
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
          },
          sso: {
            enabled: false,
            allowRegistration: true,
          },
          local: {
            enabled: true,
            allowRegistration: false,
          },
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
