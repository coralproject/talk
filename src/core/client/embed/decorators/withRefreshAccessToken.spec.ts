import sinon from "sinon";

import { wait } from "coral-framework/testHelpers";

import { RefreshAccessTokenCallback } from "../Coral";
import withRefreshAccessToken from "./withRefreshAccessToken";

it("should provide refresh access token when called", async () => {
  const token = "ACCESS_TOKEN";
  const refreshAccessToken: RefreshAccessTokenCallback = (nextAccessToken) =>
    nextAccessToken(token);
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      expect(type).toBe("getRefreshAccessToken");
      callback();
    },
    sendMessage: sinon
      .stub()
      .withArgs("refreshAccessToken", token)
      .returns(null),
  };
  withRefreshAccessToken(refreshAccessToken)(fakePym as any, null as any);
  await wait(() => expect(fakePym.sendMessage.calledOnce).toBe(true));
});

it("should throw error when calling `nextAccessToken` twice", async () => {
  const token = "ACCESS_TOKEN";
  const refreshAccessToken: RefreshAccessTokenCallback = (nextAccessToken) => {
    nextAccessToken(token);
    expect(() => nextAccessToken(token)).toThrow();
  };
  const fakePym = {
    onMessage: (type: string, callback: () => void) => {
      expect(type).toBe("getRefreshAccessToken");
      callback();
    },
    sendMessage: sinon
      .stub()
      .withArgs("refreshAccessToken", token)
      .returns(null),
  };
  withRefreshAccessToken(refreshAccessToken)(fakePym as any, null as any);
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
  withRefreshAccessToken(refreshAccessToken)(fakePym as any, null as any);
  await wait(() => expect(fakePym.sendMessage.calledOnce).toBe(true));
});
