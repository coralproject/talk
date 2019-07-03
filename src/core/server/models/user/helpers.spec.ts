import { LocalProfile, SSOProfile } from "coral-server/models/user";
import { getLocalProfile, hasLocalProfile } from "./helpers";

const localProfile: LocalProfile = {
  type: "local",
  id: "hans@email.com",
  password: "secret",
};

const ssoProfile: SSOProfile = {
  type: "sso",
  id: "sso-id",
  lastIssuedAt: new Date(0),
};

it("will get the local profile", () => {
  expect(getLocalProfile({ profiles: [localProfile] })).toEqual(localProfile);
});

it("will return undefined when it can't find the local profile", () => {
  expect(getLocalProfile({ profiles: [ssoProfile] })).toBeUndefined();
});

it("will return true when the profile exists", () => {
  expect(hasLocalProfile({ profiles: [localProfile] })).toBeTruthy();
});

it("will return true when the profile exists with the right email", () => {
  expect(
    hasLocalProfile({ profiles: [localProfile] }, localProfile.id)
  ).toBeTruthy();
});

it("will return false when the profile exists with the wrong email", () => {
  expect(
    hasLocalProfile({ profiles: [localProfile] }, "max@email.com")
  ).toBeFalsy();
});

it("will return false when the profile does not exist", () => {
  expect(hasLocalProfile({ profiles: [ssoProfile] })).toBeFalsy();
});

it("will return false when the profile does not exist with an email specified", () => {
  expect(
    hasLocalProfile({ profiles: [ssoProfile] }, "max@email.com")
  ).toBeFalsy();
});
