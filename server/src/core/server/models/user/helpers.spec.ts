import { v1 as uuid } from "uuid";

import { getLocalProfile, hasLocalProfile } from "./helpers";
import { LocalProfile, SSOProfile } from "./user";

const localProfile: LocalProfile = {
  type: "local",
  id: "hans@email.com",
  password: "secret",
  passwordID: uuid(),
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

it("will get the local profile with the correct email", () => {
  expect(
    getLocalProfile({ profiles: [localProfile] }, localProfile.id)
  ).toEqual(localProfile);
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
