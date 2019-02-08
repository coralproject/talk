import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

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
      accessTokenJTI: "JTI",
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          local: {
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
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
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without logout button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      accessTokenJTI: null,
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          local: {
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
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
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders sso only", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      accessTokenJTI: "JTI",
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: true,
            allowRegistration: true,
            targetFilter: {
              stream: false,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          local: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
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
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders sso only without logout button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      accessTokenJTI: "JTI",
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          local: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
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
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without register button", () => {
  const props: PropTypesOf<typeof UserBoxContainerN> = {
    local: {
      authPopup: {
        open: false,
        focus: false,
        view: "SIGN_IN",
      },
      accessTokenJTI: "JTI",
    },
    me: null,
    settings: {
      auth: {
        integrations: {
          facebook: {
            enabled: true,
            allowRegistration: false,
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: false,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: true,
            },
          },
          local: {
            enabled: true,
            allowRegistration: false,
            targetFilter: {
              stream: true,
            },
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
  const renderer = createRenderer();
  renderer.render(<UserBoxContainerN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
