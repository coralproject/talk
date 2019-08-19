import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

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
      accessToken: "access-token",
      accessTokenJTI: "JTI",
      accessTokenExp: 1562172094,
    },
    viewer: null,
    settings: {
      auth: {
        integrations: {
          sso: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: false,
            },
          },
          facebook: {
            enabled: true,
            allowRegistration: true,
            redirectURL: "http://localhost/facebook",
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/google",
            targetFilter: {
              stream: true,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/oidc",
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
      accessToken: "access-token",
      accessTokenJTI: null,
      accessTokenExp: null,
    },
    viewer: null,
    settings: {
      auth: {
        integrations: {
          sso: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: false,
            },
          },
          facebook: {
            enabled: true,
            allowRegistration: true,
            redirectURL: "http://localhost/facebook",
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/google",
            targetFilter: {
              stream: true,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/oidc",
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
      accessToken: "access-token",
      accessTokenJTI: "JTI",
      accessTokenExp: 1562172094,
    },
    viewer: null,
    settings: {
      auth: {
        integrations: {
          sso: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: false,
            },
          },
          facebook: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/facebook",
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: true,
            allowRegistration: true,
            redirectURL: "http://localhost/google",
            targetFilter: {
              stream: false,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/oidc",
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
      accessToken: "access-token",
      accessTokenJTI: "JTI",
      accessTokenExp: 1562172094,
    },
    viewer: null,
    settings: {
      auth: {
        integrations: {
          sso: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: false,
            },
          },
          facebook: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/facebook",
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/google",
            targetFilter: {
              stream: true,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/oidc",
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
      accessToken: "access-token",
      accessTokenJTI: "JTI",
      accessTokenExp: 1562172094,
    },
    viewer: null,
    settings: {
      auth: {
        integrations: {
          sso: {
            enabled: false,
            allowRegistration: true,
            targetFilter: {
              stream: false,
            },
          },
          facebook: {
            enabled: true,
            allowRegistration: false,
            redirectURL: "http://localhost/facebook",
            targetFilter: {
              stream: true,
            },
          },
          google: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/google",
            targetFilter: {
              stream: false,
            },
          },
          oidc: {
            enabled: false,
            allowRegistration: true,
            redirectURL: "http://localhost/oidc",
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
