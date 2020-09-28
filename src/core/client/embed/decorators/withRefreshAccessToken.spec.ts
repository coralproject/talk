import sinon from "sinon";

import { wait } from "coral-framework/testHelpers";

import withRefreshAccessToken from "./withRefreshAccessToken";

it("should provide refresh access token when called", async () => {
  const refreshAccessToken = () => "ACCESS_TOKEN";
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      expect(type).toBe("getRefreshAccessToken");
      callback();
    },
    sendMessage: sinon
      .stub()
      .withArgs("refreshAccessToken", refreshAccessToken())
      .returns(null),
  };
  withRefreshAccessToken(refreshAccessToken)(fakePym as any);
  await wait(() => expect(fakePym.sendMessage.calledOnce).toBe(true));
});

it("should provide refresh access token when called (promise) ", async () => {
  const refreshAccessToken = () => Promise.resolve("ACCESS_TOKEN");
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      expect(type).toBe("getRefreshAccessToken");
      callback();
    },
    sendMessage: sinon
      .stub()
      .withArgs("refreshAccessToken", refreshAccessToken())
      .returns(null),
  };
  withRefreshAccessToken(refreshAccessToken)(fakePym as any);
  await wait(() => expect(fakePym.sendMessage.calledOnce).toBe(true));
});

it("should send empty refresh access token when used with rejected promise", async () => {
  const refreshAccessToken = () => Promise.reject();
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      expect(type).toBe("getRefreshAccessToken");
      callback();
    },
    sendMessage: sinon.stub().withArgs("refreshAccessToken", "").returns(null),
  };
  withRefreshAccessToken(refreshAccessToken)(fakePym as any);
  await wait(() => expect(fakePym.sendMessage.calledOnce).toBe(true));
});

it("should return empty access token when no refresh access token callback provided", async () => {
  const refreshAccessToken = null;
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      expect(type).toBe("getRefreshAccessToken");
      callback();
    },
    sendMessage: sinon.stub().withArgs("refreshAccessToken", "").returns(null),
  };
  withRefreshAccessToken(refreshAccessToken)(fakePym as any);
  await wait(() => expect(fakePym.sendMessage.calledOnce).toBe(true));
});
