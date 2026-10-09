import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon, { SinonStub } from "sinon";

import { pureMerge } from "coral-common/common/lib/utils";
import { CoralContext } from "coral-framework/lib/bootstrap";
import { GQLResolver } from "coral-framework/schema";
import { createResolversStub } from "coral-framework/testHelpers";

import { createContext } from "./create";
import customRenderAppWithContext from "./customRenderAppWithContext";
import { settings } from "./fixtures";

const AUTH_URL = "http://localhost/api/auth/atproto";

const atprotoSettings = pureMerge(settings, {
  auth: {
    integrations: {
      atproto: {
        enabled: true,
        allowRegistration: true,
        targetFilter: { admin: true, stream: true },
        authURL: AUTH_URL,
      },
    },
  },
});

/**
 * The sign in forms send the browser to the authorization server with
 * window.location.href, which jsdom can't do, so the containers get a window
 * whose location is a plain object.
 */
function createFakeLocationWindow() {
  // eslint-disable-next-line no-restricted-globals
  const real = window.location;
  const location = {
    href: real.href,
    origin: real.origin,
    pathname: "/embed/auth",
    search: real.search,
    hash: real.hash,
  };
  // eslint-disable-next-line no-restricted-globals
  const proxy = new Proxy(window, {
    get(target, key) {
      if (key === "location") {
        return location;
      }
      const value = Reflect.get(target, key);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });

  return { window: proxy, location };
}

function renderView(view: "SIGN_IN" | "SIGN_UP") {
  const { context } = createContext({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: () => atprotoSettings,
      },
    }),
    initLocalState: (localRecord) => {
      localRecord.setValue(view, "view");
    },
  });

  const fake = createFakeLocationWindow();
  const renderContext: CoralContext = { ...context, window: fake.window };
  customRenderAppWithContext(renderContext);

  return { context: renderContext, location: fake.location };
}

// postAtprotoApiAuth uses the global fetch.
let fetchStub: SinonStub;
const originalFetch = (global as any).fetch;

beforeEach(() => {
  fetchStub = sinon.stub();
  (global as any).fetch = fetchStub;
});

afterEach(() => {
  (global as any).fetch = originalFetch;
});

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

async function submitHandle(button: string, handle: string) {
  const field = await screen.findByLabelText("ATproto or Bluesky Handle");
  // Set the whole value at once, typing per key loses characters in this
  // controlled input.
  await act(async () => {
    fireEvent.change(field, { target: { value: handle } });
  });
  // The submit is async, so let it settle inside act.
  await act(async () => {
    userEvent.click(screen.getByRole("button", { name: button }));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe.each([
  ["SIGN_IN" as const, "Sign in with Atproto or Bluesky"],
  ["SIGN_UP" as const, "Sign up with Atproto or Bluesky"],
])("atproto %s", (view, button) => {
  it("renders the handle form when enabled", async () => {
    renderView(view);
    await screen.findByLabelText("ATproto or Bluesky Handle");
    screen.getByRole("button", { name: button });
  });

  it("shows an error for an invalid handle without contacting the server", async () => {
    renderView(view);
    await submitHandle(button, "not a handle");

    await screen.findByText("Invalid handle");
    expect(fetchStub.called).toBe(false);
  });

  it("posts a valid handle to the auth URL", async () => {
    fetchStub.resolves(jsonResponse(404, {}));
    renderView(view);
    await submitHandle(button, "alice.bsky.social");

    await waitFor(() => expect(fetchStub.calledOnce).toBe(true));
    const [url, init] = fetchStub.firstCall.args;
    expect(url).toBe(`${AUTH_URL}?redirectTo=%2Fembed%2Fauth`);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      handle: "alice.bsky.social",
    });
  });

  it("shows the server's error message", async () => {
    fetchStub.resolves(
      jsonResponse(400, {
        error: { message: "Unable to sign in with that handle." },
      })
    );
    renderView(view);
    await submitHandle(button, "alice.bsky.social");

    await screen.findByText("Unable to sign in with that handle.");
  });

  it("shows an error when the server can't be reached", async () => {
    fetchStub.rejects(new TypeError("Failed to fetch"));
    renderView(view);
    await submitHandle(button, "alice.bsky.social");

    await screen.findByText("Unable to reach the server, please try again.");
  });

  it("goes to the authorization URL from the server", async () => {
    const authorizeURL =
      "https://bsky.social/oauth/authorize?client_id=x&request_uri=y";
    fetchStub.resolves(jsonResponse(200, { url: authorizeURL }));
    const { location } = renderView(view);
    await submitHandle(button, "alice.bsky.social");

    await waitFor(() => expect(location.href).toBe(authorizeURL));
  });

  it("refuses a non-https authorization URL", async () => {
    fetchStub.resolves(jsonResponse(200, { url: "javascript:alert(1)" }));
    const { location } = renderView(view);
    const before = location.href;
    await submitHandle(button, "alice.bsky.social");

    await screen.findByText("Sign in failed, please try again.");
    expect(location.href).toBe(before);
  });
});
